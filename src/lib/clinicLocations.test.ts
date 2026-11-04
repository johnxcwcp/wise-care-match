import { describe, expect, it } from "vitest";
import { getLocationContent } from "./clinicLocations";

describe("editable location content", () => {
  it("preserves matching values when all card labels are customized", () => {
    const values = ["Toronto", "Picton", "Yukon", "Online"];
    const settings = values.map(value => ({
      setting_key: `location_${value.toLowerCase()}_label`,
      setting_value: "Custom clinic name",
    }));
    expect(getLocationContent(settings).options.map(option => option.value)).toEqual(values);
  });
});