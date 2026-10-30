import { describe, it, expect } from "vitest";
import { eligibleModes, matchTherapists } from "./matchTherapists";
import { mapLocationFields } from "@/lib/clinicLocations";
import { Therapist, QuizAnswers } from "@/types";

const base = (over: Partial<Therapist>): Therapist => ({
  id: over.name || "x", name: "x", photo: "", pronouns: "", designation: "", bio: "",
  availability: ["Weekdays"], modalities: ["Narrative"], specialties: ["Anxiety"], gender: "Woman",
  languages: [], sessionType: [], clientTypes: ["Adults (18-65)"], services: ["Individual"], bookingLink: "",
  inPersonLocations: [], onlineLocations: [], ...over,
});

const answers = (over: Partial<QuizAnswers>): QuizAnswers => ({
  location: "Toronto", services: ["Individual"], specialties: ["Anxiety"], gender: [], modalities: [],
  availability: ["Weekdays"], sessionType: "No Preference", clientType: "Adults (18-65)", ...over,
});

const torontoInPersonOnlineElsewhere = base({ name: "A", inPersonLocations: ["Toronto"], onlineLocations: ["Picton"] });
const pictonInPerson = base({ name: "B", inPersonLocations: ["Picton"] });
const yukonOnline = base({ name: "C", onlineLocations: ["Yukon"] });
const unconfigured = base({ name: "D" });
const all = [torontoInPersonOnlineElsewhere, pictonInPerson, yukonOnline, unconfigured];
const names = (r: ReturnType<typeof matchTherapists>) => [...r.bestMatches, ...r.otherMatches].map((t) => t.name).sort();

describe("location and modality eligibility", () => {
  it("Online includes verified virtual clinicians across configured regions only", () => {
    const onlineClinicians = [
      base({ name: "Toronto virtual", locationVerified: true, onlineLocations: ["Toronto"] }),
      base({ name: "Yukon virtual", locationVerified: true, onlineLocations: ["Yukon"] }),
      base({ name: "In person only", locationVerified: true, inPersonLocations: ["Picton"] }),
      base({ name: "Unconfirmed", locationVerified: false, onlineLocations: ["Toronto"] }),
    ];
    const result = matchTherapists(onlineClinicians, answers({ location: "Online", sessionType: "Virtually" }));
    expect(names(result)).toEqual(["Toronto virtual", "Yukon virtual"]);
    expect(result.modes["Toronto virtual"]).toEqual(["Online"]);
    expect(result.modes["Yukon virtual"]).toEqual(["Online"]);
  });
  it("Toronto in-person returns only Toronto in-person clinicians", () => {
    expect(names(matchTherapists(all, answers({ location: "Toronto", sessionType: "In-person" })))).toEqual(["A"]);
  });
  it("Picton in-person excludes clinicians who only serve Picton online", () => {
    expect(names(matchTherapists(all, answers({ location: "Picton", sessionType: "In-person" })))).toEqual(["B"]);
  });
  it("Picton online returns A as online only, never in-person", () => {
    const r = matchTherapists(all, answers({ location: "Picton", sessionType: "No Preference" }));
    expect(names(r)).toEqual(["A", "B"]);
    expect(r.modes["A"]).toEqual(["Online"]);
  });
  it("Yukon in-person returns nobody when only online is configured", () => {
    expect(names(matchTherapists(all, answers({ location: "Yukon", sessionType: "In-person" })))).toEqual([]);
  });
  it("Yukon online returns the online Yukon clinician", () => {
    expect(names(matchTherapists(all, answers({ location: "Yukon", sessionType: "Virtually" })))).toEqual(["C"]);
  });
  it("clinicians with no location data are never recommended", () => {
    for (const location of ["Toronto", "Picton", "Yukon"]) {
      expect(names(matchTherapists([unconfigured], answers({ location })))).toEqual([]);
    }
  });
  it("a perfect-scoring clinician outside the location is excluded", () => {
    expect(names(matchTherapists([pictonInPerson], answers({ location: "Toronto" })))).toEqual([]);
  });
});

describe("soft preferences and fallback adjustments", () => {
  it("a soft mismatch moves a clinician to other matches", () => {
    const r = matchTherapists([torontoInPersonOnlineElsewhere], answers({ gender: ["Man"] }));
    expect(r.bestMatches).toHaveLength(0);
    expect(r.otherMatches).toHaveLength(1);
  });
  it("broadening gender turns it into a best match", () => {
    const r = matchTherapists([torontoInPersonOnlineElsewhere], answers({ gender: [] }));
    expect(r.bestMatches.map((t) => t.name)).toEqual(["A"]);
  });
  it("switching to online cannot add an in-person-only clinician", () => {
    expect(names(matchTherapists([pictonInPerson], answers({ location: "Picton", sessionType: "Virtually" })))).toEqual([]);
  });
});

describe("confirmed clinician location records", () => {
  it("all 17 confirmed online clinicians have virtual appointment records", async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Supabase connection required");
    const response = await fetch(`${url}/rest/v1/therapists?select=name,online_locations,location_verified,therapist_session_types(session_type)`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    expect(response.ok).toBe(true);
    const rows = await response.json();
    expect(rows).toHaveLength(17);
    for (const row of rows) {
      expect(row.location_verified).toBe(true);
      expect(row.online_locations.length).toBeGreaterThan(0);
      expect(row.therapist_session_types.map((s: { session_type: string }) => s.session_type)).toContain("Virtually");
    }
  });
  const loadClinicians = async (): Promise<Therapist[]> => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Supabase connection is required for location regression checks");
    const response = await fetch(`${url}/rest/v1/therapists?select=name,home_clinic,in_person_locations,online_locations,location_verified`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`Clinician read failed: ${response.status}`);
    const rows = await response.json();
    return rows.map((row: { name: string }) => base({ name: row.name, ...mapLocationFields(row) }));
  };

  it("all other current clinicians have Toronto home clinics and both Toronto session modes", async () => {
    const exceptions = ["Adam Terpstra", "Maria Aurora Zimmerling", "Marian Moon", "Penelope Park"];
    const clinicians = (await loadClinicians()).filter(t => !exceptions.includes(t.name));
    expect(clinicians).toHaveLength(13);
    for (const t of clinicians) {
      expect(t.homeClinic).toBe("Toronto");
      expect(t.locationVerified).toBe(true);
      expect(eligibleModes(t, "Toronto", "No Preference")).toEqual(["In-person", "Online"]);
    }
  });

  it("Adam offers online Toronto and Picton, with no confirmed Yukon in-person sessions", async () => {
    const adam = (await loadClinicians()).find(t => t.name === "Adam Terpstra");
    expect(adam).toBeDefined();
    if (!adam) throw new Error("Adam's record is missing");
    expect(adam.onlineLocations).toEqual(["Toronto", "Picton"]);
    expect(adam.inPersonLocations).toEqual([]);
    expect(eligibleModes(adam, "Toronto", "No Preference")).toEqual(["Online"]);
    expect(eligibleModes(adam, "Picton", "No Preference")).toEqual(["Online"]);
    expect(eligibleModes(adam, "Yukon", "In-person")).toEqual([]);
  });

  for (const name of ["Maria Aurora Zimmerling", "Marian Moon", "Penelope Park"]) {
    it(`${name} offers Picton in-person and Toronto/Yukon online sessions`, async () => {
      const t = (await loadClinicians()).find(t => t.name === name);
      expect(t).toBeDefined();
      if (!t) throw new Error(`${name}'s record is missing`);
      expect(t.homeClinic).toBe("Picton");
      expect(t.locationVerified).toBe(true);
      expect(t.inPersonLocations).toEqual(["Picton"]);
      expect(t.onlineLocations).toEqual(["Toronto", "Yukon"]);
      expect(eligibleModes(t, "Picton", "No Preference")).toEqual(["In-person"]);
      expect(eligibleModes(t, "Toronto", "No Preference")).toEqual(["Online"]);
      expect(eligibleModes(t, "Yukon", "No Preference")).toEqual(["Online"]);
    });
  }
});
