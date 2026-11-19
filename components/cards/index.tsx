import Link from 'next/link';
import type { Service, Industry, CaseStudy, Testimonial, Job } from '@/lib/data/content';

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        border: '1px solid #2e2e2e',
        borderRadius: '12px',
        padding: '32px 34px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
      className="group transition-all duration-200 hover:border-neutral-400 hover:bg-[#151515]"
    >
      <div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#888888',
            display: 'block',
            marginBottom: '16px',
            fontWeight: 700,
          }}
        >
          {String(index + 1).padStart(2, '0')} · Workflow Pillar
        </span>
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2vw, 1.55rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '14px',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {service.name}
        </h4>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#b4b4b4',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {service.shortDescription}
        </p>
      </div>

      <div
        style={{
          paddingTop: '20px',
          marginTop: '24px',
          borderTop: '1px solid #242424',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href={`/services/${service.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#1c1c1c',
            border: '1px solid #363636',
            borderRadius: '6px',
            transition: 'all 0.18s ease',
          }}
          className="hover:bg-white hover:text-black hover:border-white"
        >
          <span>Explore Workflows</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
          }}
        />
      </div>
    </div>
  );
}

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <div
      style={{
        backgroundColor: '#121212',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '32px 34px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
      className="group transition-all duration-200 hover:border-neutral-500 hover:bg-[#161616]"
    >
      <div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#888888',
            display: 'block',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          Specialization Focus
        </span>
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '12px',
            lineHeight: 1.3,
          }}
        >
          {industry.name}
        </h4>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#b0b0b0',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {industry.description}
        </p>
      </div>
    </div>
  );
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] h-full flex flex-col justify-between">
      <div>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-4">
          {caseStudy.industry}
        </span>
        <h4 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-4 leading-snug">
          {caseStudy.title}
        </h4>
        <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed line-clamp-3">
          {caseStudy.challenge}
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-[var(--obsidian-border)]/80 flex items-center justify-between">
        <Link
          href={`/resources/case-studies/${caseStudy.slug}`}
          className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--silver)] hover:text-white transition-colors no-underline"
        >
          <span>Read Case Study</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--obsidian-border-strong)]" />
      </div>
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] h-full flex flex-col justify-between">
      <div>
        <p className="font-mono text-[0.92rem] text-[var(--silver)] italic leading-relaxed mb-8">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
      <div className="font-mono text-xs border-t border-[var(--obsidian-border)] pt-5">
        <div className="font-semibold text-[var(--accent-white)] text-sm">{testimonial.name}</div>
        <div className="text-[var(--silver-dim)] text-[0.72rem] mt-1">
          {testimonial.role} · {testimonial.company}
        </div>
      </div>
    </div>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] h-full flex flex-col justify-between">
      <div>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--silver-dim)] block mb-3">
          {job.category}
        </span>
        <h4 className="font-display text-xl text-[var(--accent-white)] mb-3">{job.title}</h4>
        <p className="font-mono text-xs text-[var(--silver-muted)] mb-5">
          {job.location} · {job.employmentType}
        </p>
        <p className="font-mono text-xs md:text-sm text-[var(--silver-dim)] leading-relaxed line-clamp-3">
          {job.summary}
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-[var(--obsidian-border)]/80 flex items-center justify-between">
        <Link
          href={`/careers/${job.slug}`}
          className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--silver)] hover:text-white transition-colors no-underline"
        >
          <span>View Position</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--obsidian-border-strong)]" />
      </div>
    </div>
  );
}

export function ArticleCard({
  title,
  excerpt,
  slug,
}: {
  title: string;
  excerpt: string;
  slug: string;
}) {
  return (
    <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 sm:p-9 md:p-10 rounded-[3px] h-full flex flex-col justify-between">
      <div>
        <h4 className="font-display text-xl md:text-2xl text-[var(--accent-white)] mb-4 leading-snug">
          {title}
        </h4>
        <p className="font-mono text-xs md:text-sm text-[var(--silver-muted)] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-[var(--obsidian-border)]/80 flex items-center justify-between">
        <Link
          href={`/resources/insights/${slug}`}
          className="inline-flex items-center gap-2 font-mono text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--silver)] hover:text-white transition-colors no-underline"
        >
          <span>Read Insight</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--obsidian-border-strong)]" />
      </div>
    </div>
  );
}

export function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-interactive bg-[var(--obsidian-card)] border border-[var(--obsidian-border)] p-8 md:p-10 rounded-[3px]">
      <div className="font-display text-3xl md:text-4xl text-[var(--accent-white)] font-bold mb-2 tracking-tight">
        {value}
      </div>
      <div className="font-mono text-[0.68rem] uppercase tracking-widest text-[var(--silver-dim)]">
        {label}
      </div>
    </div>
  );
}
