
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

const rules = [
    {
        title: "Be respectful — no toxicity, slurs, death threats, doxxing, or harassment.",
        details: ["Instant permanent ban. Zero tolerance."]
    },
    {
        title: "Spoilers = crime",
        details: [
            "Use >!spoiler tags!< for ANY plot detail past the current episode",
            "Manga/LN spoilers without tags → 7-day ban (1st) → permanent (2nd)",
            "“Chapter 1056 leaks” or “future arc” talk → instant ban"
        ]
    },
    {
        title: "No source wars / format wars",
        details: [
            "No “sub > dub” or “dub > sub” spam",
            "No “manga > anime” or “anime > manga” circlejerks",
            "No “this studio ruined it” essays every 5 comments"
        ]
    },
    {
        title: "No power-level debates or “who would win” spam",
        details: [
            "“Goku vs Saitama” or “Aizen vs Madara” → deleted on sight",
            "Take it to Reddit or Discord"
        ]
    },
    {
        title: "No filler hate spam",
        details: [
            "“Skip episodes 30–60” or “entire season is filler” → deleted",
            "One polite filler list per anime is allowed. More = spam"
        ]
    },
    {
        title: "No illegal links, torrents, or download begging",
        details: ["“Where to download 4K batch?” → instant ban"]
    },
    {
        title: "No begging for release dates or “when is episode X?”",
        details: ["Check the episode list. Repeated asking = mute"]
    },
    {
        title: "No low-effort comments",
        details: [
            "“First”, “W”, “L”, “mid”, “peak fiction”, “goat” spam → deleted",
            "Reaction images only → deleted"
        ]
    },
    {
        title: "No ship wars or waifu wars",
        details: [
            "“My ship is canon, yours sunk” or “best girl” ranking spam → deleted",
            "Keep it in your bio"
        ]
    },
    {
        title: "English only in main comments",
        details: ["Other languages → use translation button or country mirror"]
    },
    {
        title: "No backseat moderating",
        details: ["Use the REPORT button, don’t mini-mod"]
    },
    {
        title: "Bans are final",
        details: ["No begging, no alts, no “it was a joke bro”"]
    }
];


export default function RulesPage() {
    return (
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
            <Card className="bg-card/50 border-border/50">
                <CardHeader className="text-center">
                    <ShieldAlert className="w-12 h-12 mx-auto text-primary" />
                    <CardTitle className="text-2xl font-bold text-glow mt-4">
                        PROJECT X COMMENT RULES — ANIME EDITION
                    </CardTitle>
                    <CardDescription className="text-lg font-mono">
                        (Read once. Break once = gone.)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {rules.map((rule, index) => (
                        <div key={index} className="border-t border-border/50 pt-4">
                            <h3 className="font-bold text-lg text-foreground">{index + 1}. {rule.title}</h3>
                            <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground text-sm pl-4">
                                {rule.details.map((detail, i) => (
                                    <li key={i}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="text-center border-t border-border/50 pt-6 mt-8">
                         <p className="font-semibold text-foreground">We’re here to talk anime, vibe, and enjoy the show — not to fight.</p>
                         <p className="text-muted-foreground">Follow the rules → stay forever.</p>
                         <p className="text-muted-foreground">Break them → disappear silently.</p>
                         <p className="mt-4 font-bold text-primary">— Project X Mod Team ⚡</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
