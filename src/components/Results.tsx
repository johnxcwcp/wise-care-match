import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuizAnswers, QuizQuestion } from "@/types";
import TherapistCard from "./TherapistCard";
import { RefreshCw, Monitor, Shuffle, SlidersHorizontal, ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MatchResult } from "@/utils/matchTherapists";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";
import { CLINIC_LOCATIONS, locationLabel } from "@/lib/clinicLocations";
import { trackEvent } from "@/lib/analytics";

interface ResultsProps {
  matchResult: MatchResult;
  answers: QuizAnswers;
  onAnswersChange: (answers: QuizAnswers) => void;
  onRestartQuiz: () => void;
}

type SoftKey = "gender" | "modalities" | "availability" | "sessionType" | "specialties";
const BROADEN: Record<SoftKey, { label: string; to: Partial<QuizAnswers>; toLabel: string }> = {
  gender: { label: "Therapist gender", to: { gender: [] }, toLabel: "No preference" },
  modalities: { label: "Therapy approach", to: { modalities: [] }, toLabel: "Any approach" },
  sessionType: { label: "In-person or online", to: { sessionType: "No Preference" }, toLabel: "Either, where available" },
  availability: { label: "Availability", to: { availability: ["Weekdays", "Evenings", "Weekends"] }, toLabel: "Weekdays, evenings or weekends" },
  specialties: { label: "What brings you to therapy", to: { specialties: [] }, toLabel: "Any area of focus" },
};

const describe = (v: string | string[]) => (Array.isArray(v) ? (v.length ? v.join(", ") : "No preference") : v || "No preference");

const Results: React.FC<ResultsProps> = ({ matchResult, answers, onAnswersChange, onRestartQuiz }) => {
  const { bestMatches, otherMatches, modes } = matchResult;
  const [storedQuestions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [broadenOpen, setBroadenOpen] = useState(false);
  const [broadenPick, setBroadenPick] = useState<SoftKey[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const noMatchTracked = useRef(false);
  const where = locationLabel(answers.location);

  const { data: siteSettings } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });
  const getSettingValue = (key: string, d: string) => siteSettings?.find((s) => s.setting_key === key)?.setting_value || d;
  const otherMatchesMessage = getSettingValue(
    "other_matches_message",
    "The clinicians below may still be a good fit for you but don't necessarily align with all of your other preferences."
  );

  const q = useMemo(() => Object.fromEntries(storedQuestions.map((x) => [x.fieldName, x])), [storedQuestions]);
  const noPerfect = bestMatches.length === 0;
  if (noPerfect && !noMatchTracked.current) {
    noMatchTracked.current = true;
    trackEvent("quiz_no_match_shown", { location: answers.location });
  }

  const apply = (patch: Partial<QuizAnswers>, action: string) => {
    const next = { ...answers, ...patch };
    onAnswersChange(next);
    // Matching is synchronous; recompute here only to report the outcome.
    import("@/utils/matchTherapists").then(() => undefined);
    trackEvent("quiz_fallback_adjustment", { action });
    setFeedback("Your results have been updated.");
  };

  const toggleIn = (key: "gender" | "modalities" | "availability" | "specialties", value: string) => {
    const list = answers[key];
    apply({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] } as Partial<QuizAnswers>, `edit_${key}`);
  };

  const chips = (key: "gender" | "modalities" | "availability" | "specialties") => {
    const question = q[key];
    if (!question) return null;
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm text-cwcp-blue mb-2">{question.title}</legend>
        <div className="flex flex-wrap gap-2">
          {question.options.filter((o) => o.value !== "Not sure" && o.value !== "No Preference").map((o) => {
            const on = answers[key].includes(o.value);
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleIn(key, o.value)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  on ? "border-cwcp-green bg-cwcp-green/10 text-foreground" : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  };

  const singleSelect = (key: "sessionType" | "clientType" | "location", label: string, options: { value: string; label: string }[]) => (
    <div className="space-y-2">
      <Label className="text-sm text-cwcp-blue">{label}</Label>
      <Select value={answers[key]} onValueChange={(v) => apply({ [key]: v } as Partial<QuizAnswers>, `edit_${key}`)}>
        <SelectTrigger aria-label={label} className="rounded-xl"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const list = (items: typeof bestMatches) => (
    <div className="space-y-6">
      {items.map((t) => <TherapistCard key={t.id} therapist={t} modes={modes[t.id]} locationName={where} />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-normal text-cwcp-blue mb-2">Your Therapist Recommendations</h2>
        <p className="text-muted-foreground mb-4">Showing clinicians who serve {where}.</p>
        <Button onClick={onRestartQuiz} variant="outline" className="rounded-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Start Over
        </Button>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{feedback}</p>

      {!noPerfect ? (
        <div className="mb-12">
          <h3 className="text-2xl font-normal mb-4 text-cwcp-green">Best Matches</h3>
          <p className="text-cwcp-darkgray mb-6">
            These clinicians match all of your specified criteria. You may also choose any therapist outside of the suggestion shown here.
          </p>
          {list(bestMatches)}
        </div>
      ) : (
        <section className="mb-12 glass-card rounded-2xl p-6 sm:p-8 space-y-6" aria-labelledby="fallback-heading">
          <div>
            <h3 id="fallback-heading" className="text-2xl font-normal text-cwcp-blue mb-2">Let's find a therapist who could be a good fit.</h3>
            <p className="text-cwcp-darkgray">
              We couldn't find a clinician who matches all your current preferences. You can adjust a few of your answers below to explore other available options.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="rounded-full justify-start" disabled={answers.sessionType === "Virtually"}
              onClick={() => apply({ sessionType: "Virtually" }, "explore_online")}>
              <Monitor className="mr-2 h-4 w-4" /> Explore online counselling
            </Button>
            <Button variant="outline" className="rounded-full justify-start" disabled={answers.modalities.length === 0 || answers.modalities.includes("Not sure")}
              onClick={() => apply({ modalities: [] }, "other_approaches")}>
              <Shuffle className="mr-2 h-4 w-4" /> Consider other therapeutic approaches
            </Button>
            <Button variant="outline" className="rounded-full justify-start" onClick={() => { setBroadenPick([]); setBroadenOpen(true); }}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Broaden my preferences
            </Button>
            <Button variant="outline" className="rounded-full justify-start"
              onClick={() => { trackEvent("quiz_fallback_adjustment", { action: "review_answers" }); editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); editorRef.current?.focus(); }}>
              <ListChecks className="mr-2 h-4 w-4" /> Review my answers
            </Button>
          </div>

          <div ref={editorRef} tabIndex={-1} className="space-y-6 border-t border-border pt-6 focus:outline-none">
            <h4 className="text-lg font-normal text-cwcp-blue">Your answers</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {singleSelect("location", "Location", CLINIC_LOCATIONS.map((l) => ({ value: l.value, label: l.label })))}
              {q.sessionType && singleSelect("sessionType", "In-person or online", q.sessionType.options)}
              {q.clientType && singleSelect("clientType", "Age range", q.clientType.options)}
            </div>
            {chips("specialties")}
            {chips("gender")}
            {chips("modalities")}
            {chips("availability")}
          </div>

          {otherMatches.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No clinicians currently serve {where} with these answers. Try another adjustment above, or contact us and we'll help you directly.
            </p>
          )}
        </section>
      )}

      {otherMatches.length > 0 && (
        <div>
          <h3 className="text-2xl font-normal mb-4 text-cwcp-green">Other Clinicians You May Be Interested In</h3>
          <p className="text-cwcp-darkgray mb-6">{otherMatchesMessage}</p>
          {list(otherMatches)}
        </div>
      )}

      <Dialog open={broadenOpen} onOpenChange={setBroadenOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-normal">Broaden my preferences</DialogTitle>
            <DialogDescription>Choose what you're open to changing. Your location ({where}) stays the same.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {(Object.keys(BROADEN) as SoftKey[]).map((k) => (
              <div key={k} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <Checkbox id={`broaden-${k}`} checked={broadenPick.includes(k)}
                  onCheckedChange={() => setBroadenPick((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]))} />
                <Label htmlFor={`broaden-${k}`} className="font-normal cursor-pointer space-y-1">
                  <span className="block">{BROADEN[k].label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {describe(answers[k])} → {BROADEN[k].toLabel}
                  </span>
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setBroadenOpen(false)}>Cancel</Button>
            <Button className="rounded-full" disabled={broadenPick.length === 0}
              onClick={() => {
                apply(Object.assign({}, ...broadenPick.map((k) => BROADEN[k].to)), "broaden");
                setBroadenOpen(false);
              }}>
              Apply changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
