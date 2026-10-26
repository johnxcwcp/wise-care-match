import { describe, it, expect } from "vitest";
import { matchTherapists } from "./matchTherapists";
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
