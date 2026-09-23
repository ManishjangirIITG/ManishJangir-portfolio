import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Professional Profile | Manish Jangir",
  description:
    "Professional profile for Manish Jangir covering software engineering, backend systems, machine learning, data engineering, and selected project work.",
};

const projects = [
  {
    period: "Aug 2025 — Nov 2025",
    title: "Bachelor's Thesis Project I — Molecular Spectra Prediction via GNNs",
    context: "Indian Institute of Technology, Guwahati · Advised by Prof. KSB",
    points: [
      "Researched NMR/IR prediction from molecular topology using Graph Neural Networks and synthesized 25+ peer-reviewed papers into a modeling approach.",
      "Built an RDKit SMILES-to-graph pipeline with sanitization and valency validation across a 250,000+ molecule training corpus.",
      "Designed a custom MPNN and graph-construction pipeline that reduced preprocessing time by 45%.",
    ],
  },
  {
    period: "Jan 2026 — Mar 2026",
    title: "Bachelor's Thesis Project II — GNN Optimization & Deployment",
    context: "Indian Institute of Technology, Guwahati · Advised by Prof. KSB",
    points: [
      "Tuned preprocessing and the loss function to achieve deterministic convergence and reduce training variance by 35%.",
      "Built a stateless FastAPI inference service with request batching, sustaining 400 req/s at 43 ms P95 latency.",
      "Used RDKit validation at the API edge and multi-stage Docker builds that reduced container image size by 60%+.",
    ],
  },
  {
    period: "Apr 2025 — Jun 2025",
    title: "Cryptocurrency Price Prediction — ML Forecasting System",
    context: "Python · XGBoost · Scikit-learn · Time Series Modeling · REST APIs · Git",
    points: [
      "Combined 36+ months of Bitcoin price history with Wikipedia edit activity and engineered 12+ features.",
      "Built a Random Forest baseline and a backtesting system before moving to XGBoost.",
      "Reached 52.8% directional forecasting accuracy with the XGBoost model.",
    ],
  },
  {
    period: "Jan 2025 — Mar 2025",
    title: "UR VDO — Full-Stack Video Streaming Platform",
    context: "Next.js · React · TailwindCSS · MongoDB · FFmpeg · ipapi · Git",
    points: [
      "Built a full-stack video platform with JWT authentication and Razorpay sandbox subscriptions.",
      "Designed indexed MongoDB schemas for likes, comments, and channels, with sub-40 ms query latency at 10,000+ records.",
      "Implemented adaptive bitrate streaming with FFmpeg across 480p/720p/1080p, reducing media load latency by 40% in local throttling tests.",
    ],
  },
] as const;

const skills = [
  { label: "Languages", value: "C++, Python, C, SQL (MySQL), JavaScript, HTML/CSS" },
  { label: "Frontend & Web", value: "React, Next.js, Tailwind CSS" },
  {
    label: "AI/ML & Deep Learning",
    value:
      "PyTorch, PyTorch Geometric, Scikit-learn, XGBoost, Random Forest, RDKit, Time Series Modeling, GNNs/MPNNs",
  },
  {
    label: "Data Engineering & Analytics",
    value: "PySpark, Pandas, NumPy, Matplotlib",
  },
  {
    label: "Backend & APIs",
    value: "FastAPI, REST API Design, Microservices, Node.js, Flask, JWT Authentication",
  },
  {
    label: "Cloud & DevOps",
    value: "AWS (S3, ECR, EC2, EKS), Docker, GitHub Actions, CI/CD, Linux",
  },
  { label: "Developer Tools", value: "Git, VS Code, Postman" },
] as const;

export default function ResumePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
              Professional profile / public view
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Manish Jangir
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              IIT Guwahati graduate with hands-on work across graph machine learning, backend
              engineering, full-stack development, data workflows, and deployment-oriented systems.
            </p>
          </div>

          <div className="max-w-sm border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--primary)]">
              Privacy by design
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              This page is a public, sanitized professional profile. A full resume containing
              private contact information is not published or directly downloadable from this site.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[220px_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
                Experience
              </p>
            </div>
            <article>
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    Consultant I — Data Science &amp; Analytics
                  </h2>
                  <p className="mt-1 text-sm text-[var(--primary)]">EXL Service · India</p>
                </div>
                <span className="font-mono text-xs text-[var(--subtle)]">Jun 2026 — Present</span>
              </div>
              <ul className="mt-5 space-y-2 text-[var(--muted)]">
                <li>Joined the Data Science &amp; Analytics practice through campus placement.</li>
                <li>
                  Currently completing structured onboarding and training in SQL, Python, and data
                  analytics workflows ahead of upcoming client project assignments.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Education
            </p>
          </div>
          <article className="border-b border-[var(--border)] pb-10">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-semibold">Indian Institute of Technology, Guwahati</h2>
                <p className="mt-1 text-[var(--muted)]">
                  Bachelor of Technology in Chemical Science and Technology · 8.18 CGPA
                </p>
              </div>
              <span className="font-mono text-xs text-[var(--subtle)]">Oct 2022 — Jul 2026</span>
            </div>
          </article>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-[220px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Selected work
            </p>
          </div>
          <div className="space-y-10">
            {projects.map((project) => (
              <article key={project.title} className="border-b border-[var(--border)] pb-10">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{project.title}</h2>
                    <p className="mt-1 text-sm text-[var(--primary)]">{project.context}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-[var(--subtle)]">
                    {project.period}
                  </span>
                </div>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--muted)]">
                  {project.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--subtle)]">
                        —
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[220px_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
                Technical skills
              </p>
            </div>
            <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {skills.map((skill) => (
                <div
                  key={skill.label}
                  className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:gap-6"
                >
                  <dt className="font-mono text-xs text-[var(--subtle)]">{skill.label}</dt>
                  <dd className="text-sm leading-6 text-[var(--muted)]">{skill.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-t border-[var(--border)] pt-12 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--primary)]">
              Next
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              See the systems behind the bullets.
            </h2>
            <p className="mt-3 max-w-xl text-[var(--muted)]">
              The project case studies go deeper into architecture, implementation decisions,
              tradeoffs, and verified results.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="border border-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
              prefetch={false}
            >
              View projects
            </Link>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--muted)]"
            >
              Connect on LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
