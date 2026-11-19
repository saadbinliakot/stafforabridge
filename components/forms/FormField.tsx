import clsx from 'clsx';

/** Base input classes — dark premium style with explicit box-sizing and width constraint */
const baseInputClasses =
  'input-dark w-full min-w-0 box-border text-[var(--silver)] font-mono text-sm';

interface FieldWrapperProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, name, required, error, hint, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <label
        htmlFor={name}
        className="font-mono text-xs uppercase tracking-widest font-medium text-[var(--silver-muted)]"
      >
        {label}{' '}
        {required && (
          <span aria-hidden="true" className="text-[var(--silver)]">
            *
          </span>
        )}
      </label>
      <div className="w-full min-w-0">{children}</div>
      {hint && <p className="text-xs font-mono text-[var(--silver-dim)]">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-mono font-semibold text-red-400">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

export function FormField({
  label,
  name,
  type = 'text',
  required,
  error,
  hint,
  style,
  ...rest
}: Omit<FieldWrapperProps, 'children'> & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={clsx(baseInputClasses, error && '!border-red-400/80')}
        style={{ paddingLeft: '1.4rem', paddingRight: '1.4rem', ...style }}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function FormTextarea({
  label,
  name,
  required,
  error,
  hint,
  rows = 5,
  ...rest
}: Omit<FieldWrapperProps, 'children'> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error} hint={hint}>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={clsx(baseInputClasses, 'resize-y', error && '!border-red-400/80')}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function FormSelect({
  label,
  name,
  required,
  error,
  hint,
  options,
  className,
  ...rest
}: Omit<FieldWrapperProps, 'children'> &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
  }) {
  return (
    <FieldWrapper label={label} name={name} required={required} error={error} hint={hint}>
      <div className="relative w-full min-w-0">
        <select
          id={name}
          name={name}
          required={required}
          aria-invalid={Boolean(error)}
          className={clsx(
            baseInputClasses,
            'appearance-none pr-10 [color-scheme:dark] cursor-pointer',
            error && '!border-red-400/80',
            className
          )}
          style={{ backgroundColor: 'var(--obsidian-card)', color: 'var(--silver)', paddingLeft: '1.4rem', paddingRight: '2.5rem' }}
          {...rest}
        >
          <option value="" className="bg-[#0e0e0e] text-neutral-400">Select…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#121212] text-white py-1.5">
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </FieldWrapper>
  );
}

export function FormCheckbox({
  label,
  name,
  required,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name={name}
          required={required}
          className="mt-1 h-4 w-4 rounded-[2px] border border-[var(--obsidian-border-strong)] bg-[var(--obsidian-elevated)] accent-white cursor-pointer"
        />
        <span className="font-mono text-xs leading-relaxed text-[var(--silver-muted)]">
          {label} {required && <span className="text-[var(--silver)]">*</span>}
        </span>
      </label>
      {error && (
        <p role="alert" className="text-xs font-mono font-semibold text-red-400 pl-7">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
