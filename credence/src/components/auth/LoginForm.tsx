import { useState } from "react";
import type { FormEvent } from "react";

type FormErrors = {
  email?: string;
  password?: string;
};

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.6 4.3 9.5 6-.4.8-1.3 2-2.7 3.2M6.2 6.2C3.9 7.7 2.7 10 2.5 11c.9 1.7 4.3 6 9.5 6 1 0 1.9-.2 2.8-.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!email.trim()) nextErrors.email = "Business email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid business email.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    window.setTimeout(() => setIsSubmitting(false), 900);
  }

  return (
    <form className="w-full max-w-105" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label
            className="mb-2 block text-[13px] font-semibold text-[#344344]"
            htmlFor="email"
          >
            Business email
          </label>
          <input
            className={`h-12 w-full rounded-[9px] border bg-white px-4 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${errors.email ? "border-[#c66b68]" : "border-[#dce3df]"}`}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email)
                setErrors((current) => ({ ...current, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-[#b34f55]" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              className="block text-[13px] font-semibold text-[#344344]"
              htmlFor="password"
            >
              Password
            </label>
            <a
              className="text-xs font-semibold text-[#4c755f] hover:underline"
              href="#forgot-password"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              className={`h-12 w-full rounded-[9px] border bg-white px-4 pr-12 text-sm text-[#203333] outline-none transition placeholder:text-[#a7b0ad] focus:border-[#527f6a] focus:ring-4 focus:ring-[#527f6a]/10 ${errors.password ? "border-[#c66b68]" : "border-[#dce3df]"}`}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password)
                  setErrors((current) => ({ ...current, password: undefined }));
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#899590] hover:bg-[#eff3f0] hover:text-[#42674f]"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-[#b34f55]" id="password-error">
              {errors.password}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs text-[#6d7974]">
          <input
            className="size-4 rounded border-[#cbd6d0] accent-[#234d3c]"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember me
        </label>

        <button
          className="h-12 w-full rounded-[9px] bg-[#183b36] text-sm font-semibold text-white shadow-[0_7px_18px_rgba(24,59,54,0.18)] transition hover:bg-[#102f2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527f6a] disabled:cursor-wait cursor-pointer disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <p className="mt-7 text-center text-sm text-[#77827d]">
        New to Credence?{" "}
        <a
          className="font-semibold text-[#416d54] hover:underline"
          href="#create-account"
        >
          Create an account
        </a>
      </p>
      <p className="mt-7 sm:mt-10 lg:mt-16 text-center text-[11px] leading-5 text-[#9aa39f]">
        Your data is encrypted and protected. Credence is built with security
        and compliance at its core.
      </p>
    </form>
  );
}
