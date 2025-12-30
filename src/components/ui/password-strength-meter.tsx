import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return {
      score: 0,
      label: "Sehr schwach",
      color: "bg-red-500",
      suggestions: ["Geben Sie ein Passwort ein"],
    };
  }

  // Length check
  if (password.length < 8) {
    suggestions.push("Mindestens 8 Zeichen");
  } else if (password.length >= 8) {
    score++;
  }
  if (password.length >= 12) score++;

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    suggestions.push("Kleinbuchstaben hinzufügen");
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push("Großbuchstaben hinzufügen");
  }

  // Contains numbers
  if (/\d/.test(password)) {
    score++;
  } else {
    suggestions.push("Zahlen hinzufügen");
  }

  // Contains special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++;
  } else {
    suggestions.push("Sonderzeichen hinzufügen (!@#$%...)");
  }

  // Common passwords check
  const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "abc123",
    "monkey",
    "letmein",
    "trustno1",
    "dragon",
    "baseball",
    "iloveyou",
    "master",
    "sunshine",
    "ashley",
    "bailey",
    "shadow",
    "superman",
    "qazwsx",
    "michael",
    "football",
  ];

  if (
    commonPasswords.some((common) => password.toLowerCase().includes(common))
  ) {
    score = Math.max(0, score - 2);
    suggestions.push("Vermeiden Sie häufige Passwörter");
  }

  // Sequential characters check
  if (
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
      password
    )
  ) {
    score = Math.max(0, score - 1);
    suggestions.push("Vermeiden Sie aufeinanderfolgende Zeichen");
  }

  // Determine strength label and color
  const strengthLevels = [
    { score: 0, label: "Sehr schwach", color: "bg-red-500" },
    { score: 1, label: "Schwach", color: "bg-orange-500" },
    { score: 2, label: "Mittel", color: "bg-yellow-500" },
    { score: 3, label: "Stark", color: "bg-lime-500" },
    { score: 4, label: "Sehr stark", color: "bg-green-500" },
  ];

  const normalizedScore = Math.min(4, Math.max(0, Math.floor(score / 1.5)));
  const strength = strengthLevels[normalizedScore];

  return {
    score: normalizedScore,
    label: strength.label,
    color: strength.color,
    suggestions:
      suggestions.length > 0 ? suggestions : ["Ausgezeichnetes Passwort! 🎉"],
  };
}

export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const strength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              level <= strength.score ? strength.color : "bg-neutral-3"
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-11">Passwortstärke:</span>
        <span
          className={cn(
            "font-semibold",
            strength.score === 0 && "text-red-600",
            strength.score === 1 && "text-orange-600",
            strength.score === 2 && "text-yellow-600",
            strength.score === 3 && "text-lime-600",
            strength.score === 4 && "text-green-600"
          )}
        >
          {strength.label}
        </span>
      </div>

      {/* Suggestions */}
      {strength.suggestions.length > 0 && strength.score < 4 && (
        <ul className="text-xs text-neutral-11 space-y-1">
          {strength.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <span className="text-neutral-9 mt-0.5">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Strong password indicator */}
      {strength.score === 4 && (
        <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
          <span>✓</span>
          <span>Ausgezeichnetes Passwort!</span>
        </p>
      )}
    </div>
  );
}
