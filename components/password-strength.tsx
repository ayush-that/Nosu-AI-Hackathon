"use client";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let score = 0;
    if (!password) return score;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 5);
  };

  const strength = getStrength(password);
  const width = `${(strength / 5) * 100}%`;

  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getMessage = () => {
    if (!password) return "Enter password";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="w-full space-y-1">
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getColor()}`}
          style={{ width }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{getMessage()}</p>
    </div>
  );
}
