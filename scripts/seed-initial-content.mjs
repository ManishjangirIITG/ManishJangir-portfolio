// import dotenv from "dotenv";
import postgres from "postgres";

// dotenv.config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Set DATABASE_URL before running the initial content seed.");
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });

const projects = [
  {
    slug: "molecular-spectra-prediction-gnns",
    startDate: "2025-08-01",
    endDate: "2025-11-01",
    title: "Bachelor's Thesis Project I — Molecular Spectra Prediction via GNNs",
    summary:
      "Researched molecular spectra (NMR/IR) prediction from molecular topology using Graph Neural Networks, including a validated SMILES-to-graph preprocessing pipeline and a custom Message-Passing Neural Network.",
    technologies: ["Python", "PyTorch", "PyTorch Geometric", "RDKit", "GNNs/MPNNs"],
    sections: [
      {
        type: "approach",
        title: "Approach",
        body: "Synthesized 25+ peer-reviewed papers into a modeling approach for predicting molecular spectra from molecular topology. Built a SMILES-to-graph preprocessing pipeline with automated sanitization and valency validation.",
      },
      {
        type: "implementation",
        title: "Implementation",
        body: "Designed a custom Message-Passing Neural Network with 3-layer Message-Aggregate-Update propagation and 1–3 bond-radius contextualization, together with graph-construction pipelines for the training corpus.",
      },
      {
        type: "verified_results",
        title: "Verified Results",
        body: "Validated input integrity across 250,000+ molecules and reduced preprocessing time by 45% while processing the 250,000+ molecule corpus.",
      },
    ],
  },
  {
    slug: "gnn-optimization-deployment",
    startDate: "2026-01-01",
    endDate: "2026-03-01",
    title: "Bachelor's Thesis Project II — GNN Optimization & Deployment",
    summary:
      "Optimized a custom GNN pipeline and deployed inference through a stateless FastAPI microservice with request batching, API-edge molecular validation, and containerized delivery.",
    technologies: ["Python", "FastAPI", "RDKit", "Docker", "CI/CD", "GNNs/MPNNs"],
    sections: [
      {
        type: "implementation",
        title: "Implementation",
        body: "Tuned preprocessing and the loss function for deterministic convergence. Built a stateless FastAPI inference service with custom request batching and embedded RDKit validation at the API edge. Used multi-stage Docker builds to streamline deployment workflows.",
      },
      {
        type: "verified_results",
        title: "Verified Results",
        body: "Reduced training variance by 35%, sustained 400 requests/second at 43 ms P95 latency, caught 100% of invalid molecular inputs before inference, and reduced container image size by 60%+.",
      },
    ],
  },
  {
    slug: "cryptocurrency-price-prediction",
    startDate: "2025-08-01",
    endDate: "2025-09-01",
    title: "Cryptocurrency Price Prediction — ML Forecasting System",
    summary:
      "Built a Bitcoin forecasting workflow using historical price and Wikipedia edit activity, feature engineering, baseline modeling, XGBoost, and backtesting.",
    technologies: [
      "Python",
      "XGBoost",
      "Scikit-learn",
      "Time Series Modeling",
      "REST APIs",
      "Git",
      "Random Forest",
    ],
    sections: [
      {
        type: "approach",
        title: "Approach",
        body: "Collected and analyzed 36+ months of historical Bitcoin price data alongside Wikipedia edit activity and engineered 12+ features to investigate leading indicators of market behavior. Built a Random Forest baseline before later model iterations.",
      },
      {
        type: "implementation",
        title: "Implementation",
        body: "Developed a backtesting system to simulate trading performance and transitioned the forecasting model to XGBoost.",
      },
      {
        type: "verified_results",
        title: "Verified Results",
        body: "The XGBoost iteration achieved 52.8% directional forecasting accuracy.",
      },
    ],
  },
  {
    slug: "ur-vdo",
    startDate: "2025-01-01",
    endDate: "2025-03-01",
    title: "UR VDO — Full-Stack Video Streaming Platform",
    summary:
      "Developed a full-stack video streaming platform with authentication, subscription payments, indexed social data, geolocation-aware OTP delivery, and adaptive bitrate streaming.",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "MongoDB",
      "FFmpeg",
      "ipapi",
      "Git",
      "JWT Authentication",
    ],
    sections: [
      {
        type: "implementation",
        title: "Implementation",
        body: "Built the platform with React and Next.js and JWT-based authentication. Integrated Razorpay in sandbox mode for premium subscriptions with webhooks automating PDF invoices and emails. Designed indexed MongoDB schemas for likes, comments, and channels, implemented geolocation-aware OTP routing through SMS or email, and enabled 480p/720p/1080p adaptive bitrate streaming with FFmpeg.",
      },
      {
        type: "verified_results",
        title: "Verified Results",
        body: "Indexed MongoDB queries achieved sub-40 ms latency at 10,000+ records. Adaptive bitrate streaming reduced media load latency by 40% under local network throttling tests.",
      },
    ],
  },
];

const experiences = [
  {
    organization: "EXL Service India",
    role: "Consultant I — Data Science & Analytics",
    location: null,
    employmentType: null,
    summary:
      "Joined EXL as Consultant I in the Data Science & Analytics practice through campus placement. Currently completing structured onboarding and training in SQL, Python, and data analytics workflows ahead of upcoming client project assignments.",
    startDate: "2026-06-01",
    endDate: null,
    isCurrent: true,
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function seed() {
  await sql.begin(async (tx) => {
    for (const [sortOrder, project] of projects.entries()) {
      const [row] = await tx`
        insert into projects (slug, title, summary, status, featured, sort_order, start_date, end_date, published_at)
        values (${project.slug}, ${project.title}, ${project.summary}, 'published', false, ${sortOrder}, ${project.startDate}, ${project.endDate}, now())
        on conflict (slug) do update set
          title = excluded.title,
          summary = excluded.summary,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          updated_at = now()
        returning id
      `;

      if (!row) throw new Error(`Failed to seed project: ${project.slug}`);

      for (const technology of project.technologies) {
        const technologySlug = slugify(technology);
        const [tech] = await tx`
          insert into technologies (name, slug)
          values (${technology}, ${technologySlug})
          on conflict (slug) do update set name = excluded.name
          returning id
        `;
        if (!tech) throw new Error(`Failed to seed technology: ${technology}`);
        await tx`
          insert into project_technologies (project_id, technology_id)
          values (${row.id}, ${tech.id})
          on conflict do nothing
        `;
      }

      for (const [sectionOrder, section] of project.sections.entries()) {
        await tx`
          insert into project_sections (project_id, type, title, body, sort_order)
          values (${row.id}, ${section.type}, ${section.title}, ${section.body}, ${sectionOrder})
          on conflict (project_id, sort_order) do update set
            type = excluded.type,
            title = excluded.title,
            body = excluded.body,
            updated_at = now()
        `;
      }
    }

    for (const [sortOrder, experience] of experiences.entries()) {
      const existing = await tx`
        select id from experiences
        where organization = ${experience.organization}
          and role = ${experience.role}
          and start_date = ${experience.startDate}
        limit 1
      `;

      if (existing.length > 0) {
        await tx`
          update experiences set
            summary = ${experience.summary},
            status = 'published',
            end_date = ${experience.endDate},
            is_current = ${experience.isCurrent},
            sort_order = ${sortOrder},
            updated_at = now()
          where id = ${existing[0].id}
        `;
      } else {
        await tx`
          insert into experiences (
            organization, role, location, employment_type, summary, status,
            start_date, end_date, is_current, sort_order
          ) values (
            ${experience.organization}, ${experience.role}, ${experience.location},
            ${experience.employmentType}, ${experience.summary}, 'published',
            ${experience.startDate}, ${experience.endDate}, ${experience.isCurrent}, ${sortOrder}
          )
        `;
      }
    }
  });
}

try {
  await seed();
  console.log(
    `Initial content seeded: ${projects.length} projects, ${experiences.length} experience entry, 0 updates.`,
  );
} finally {
  await sql.end();
}
