import Link from "next/link";

import { PageCta } from "@/components/shared/PageCta";
import "./ai-training-detail.scss";

interface LevelModule {
  code: string;
  name: string;
  topics: string;
}

interface TrainingLevel {
  num: string;
  accentClass: string;
  eyebrow: string;
  title: string;
  audience: string;
  vision: string;
  objectives: string[];
  modules: LevelModule[];
  applications: string[];
}

const TRAINING_LEVELS: TrainingLevel[] = [
  {
    num: "L1",
    accentClass: "level--pink",
    eyebrow: "Level 1 · Primary Education",
    title: "Foundations for Primary Education",
    audience: "Learners aged 8-11",
    vision: "Helping young learners understand what AI is, where it appears in their daily lives, and how to engage with it safely, creatively, and responsibly.",
    objectives: [
      "Understand what AI is in simple, accessible terms",
      "Recognise AI systems encountered in everyday life",
      "Use AI tools safely and responsibly",
      "Develop foundational digital citizenship skills",
      "Explore creativity and learning through AI-supported activities",
    ],
    modules: [
      { code: "M1", name: "What Is AI?", topics: "Machines that learn · AI vs humans · What AI can and cannot do" },
      { code: "M2", name: "AI in Everyday Life", topics: "Smart assistants · Recommendation systems · Games & entertainment" },
      { code: "M3", name: "Safe and Responsible AI Use", topics: "Privacy & personal information · Safe online behaviour · Trustworthy information" },
      { code: "M4", name: "Creativity and Learning with AI", topics: "Storytelling · Drawing & image generation · Brainstorming · Learning support" },
      { code: "M5", name: "Digital Citizenship", topics: "Respectful communication · Digital footprints · Healthy technology habits" },
    ],
    applications: [
      "AI-assisted storytelling exercises",
      "Creative drawing & image generation tasks",
      "Digital safety role-play activities",
    ],
  },
  {
    num: "L2",
    accentClass: "level--soft-pink",
    eyebrow: "Level 2 · Secondary Education",
    title: "Foundations for Secondary Education",
    audience: "Learners aged 12-15",
    vision: "Building critical thinking, media literacy, and ethical awareness so young people can navigate an AI-saturated information environment with confidence and discernment.",
    objectives: [
      "Understand how AI systems work at a foundational level",
      "Develop critical thinking about AI-generated content",
      "Identify misinformation, deepfakes, and manipulation",
      "Apply ethical principles when using AI",
      "Begin communicating effectively with AI systems",
    ],
    modules: [
      { code: "M1", name: "Understanding AI Systems", topics: "How AI learns · Training & prediction · Algorithms · Limitations" },
      { code: "M2", name: "Critical Thinking and AI", topics: "Evaluating AI information · Fact-checking · Detecting hallucinations · Human oversight" },
      { code: "M3", name: "AI and Media Literacy", topics: "Deepfakes · Synthetic media · Misinformation · Social media algorithms" },
      { code: "M4", name: "Ethics, Fairness, and Bias", topics: "Sources of bias · Fairness in AI · Representation & inclusion · Ethical decision-making" },
      { code: "M5", name: "Introduction to Prompting", topics: "Asking effective questions · Clear instructions · Evaluating & improving AI responses" },
    ],
    applications: [
      "Deepfake and misinformation detection exercises",
      "Bias audit of AI-generated content",
      "Hands-on prompt design and evaluation tasks",
    ],
  },
  {
    num: "L3",
    accentClass: "level--teal",
    eyebrow: "Level 3 · High School Education",
    title: "Foundations for High School Education",
    audience: "Learners aged 16-18",
    vision: "Preparing students to use generative AI as a genuine learning tool - conducting better research, thinking about societal impact, and making informed choices about their futures in an AI-transformed world.",
    objectives: [
      "Understand generative AI technologies and how they work",
      "Apply AI effectively in study and learning contexts",
      "Conduct AI-supported academic research",
      "Analyse the societal impacts of AI systems",
      "Explore future educational and career pathways in an AI-enabled world",
    ],
    modules: [
      { code: "M1", name: "Generative AI and Large Language Models", topics: "How generative AI works · LLMs · Strengths & limitations · Emerging technologies" },
      { code: "M2", name: "AI-Assisted Learning", topics: "Study support · Personalised learning · Note-taking & summarisation · Productivity" },
      { code: "M3", name: "Research Skills in the Age of AI", topics: "Information literacy · Source evaluation · Academic research · AI-assisted inquiry" },
      { code: "M4", name: "AI Ethics and Governance", topics: "Regulation & policy · Intellectual property · Data protection · Responsible innovation" },
      { code: "M5", name: "Future Careers and AI", topics: "Changing job markets · Human-AI collaboration · Emerging professions · Lifelong learning" },
    ],
    applications: [
      "AI-supported research project",
      "Ethics and governance case study",
      "Career futures exploration portfolio",
    ],
  },
  {
    num: "L4",
    accentClass: "level--mint",
    eyebrow: "Level 4 · Higher Education",
    title: "Foundations for Higher Education",
    audience: "Undergraduate & postgraduate students, all disciplines",
    vision: "Equipping university students across all disciplines with the critical AI literacy, responsible use practices, and prompt engineering skills needed to engage with AI as thoughtful, academically grounded scholars.",
    objectives: [
      "Demonstrate AI literacy and critical evaluation skills",
      "Use AI effectively for learning and academic research",
      "Apply prompt engineering techniques in scholarly contexts",
      "Understand and uphold academic integrity requirements",
      "Make informed, ethically grounded decisions regarding AI use",
    ],
    modules: [
      { code: "M1", name: "AI Literacy and Critical Evaluation", topics: "Understanding AI systems · Evaluating outputs · Reliability · Human oversight" },
      { code: "M2", name: "Prompt Engineering", topics: "Design principles · Iterative prompting · Role prompting · Research prompting" },
      { code: "M3", name: "Academic Integrity and AI", topics: "Responsible AI use · Transparency & disclosure · Institutional policies · Ethics" },
      { code: "M4", name: "AI for Learning and Productivity", topics: "Knowledge management · Study support · Project planning · Collaboration tools" },
      { code: "M5", name: "Responsible and Ethical AI Use", topics: "Bias & fairness · Privacy & security · Sustainability · Human-centered design" },
    ],
    applications: [
      "AI literacy and critical evaluation portfolio",
      "Discipline-specific prompt engineering project",
      "Ethical reflection and disclosure report",
    ],
  },
  {
    num: "L5",
    accentClass: "level--brand",
    eyebrow: "Level 5 · Academic Research Specialisation",
    title: "Academic Writing and Research Communication",
    audience: "Advanced undergraduates, postgraduates, researchers & academics",
    vision: "Enabling researchers and academics to integrate AI into rigorous scholarly workflows - from literature discovery to publication ethics - while maintaining the methodological integrity and intellectual ownership their work demands.",
    objectives: [
      "Integrate AI into academic writing workflows responsibly",
      "Conduct systematic literature exploration with AI support",
      "Improve research communication practices for diverse audiences",
      "Critically evaluate AI-assisted outputs at every research stage",
      "Maintain academic integrity and ethical disclosure standards",
    ],
    modules: [
      { code: "M1", name: "AI-Assisted Academic Writing", topics: "Idea development · Outlining · Drafting support · Revision strategies" },
      { code: "M2", name: "Literature Reviews and Knowledge Discovery", topics: "Search strategies · AI-powered research tools · Evidence synthesis · Gap identification" },
      { code: "M3", name: "AI-Supported Research Workflows", topics: "Research planning · Data organisation · Project management · Knowledge management" },
      { code: "M4", name: "Scholarly Communication", topics: "Academic style · Audience adaptation · Research dissemination · Public communication" },
      { code: "M5", name: "Publication Ethics and Responsible AI", topics: "Authorship · Transparency · Citation practices · Ethical disclosure" },
    ],
    applications: [
      "AI-assisted systematic literature review",
      "Research communication and dissemination portfolio",
      "Authorship and AI use statement",
    ],
  },
  {
    num: "L6",
    accentClass: "level--cosmic",
    eyebrow: "Level 6 · Language Technology Specialisation",
    title: "Translation Technologies and Multilingual AI",
    audience: "Students & professionals in translation, linguistics, localization & language fields",
    vision: "Equipping language professionals and researchers to critically understand, evaluate, and work with the full spectrum of translation and multilingual AI technologies - from NLP foundations to ethical implications for low-resource languages.",
    objectives: [
      "Understand the evolution of language technologies and NLP",
      "Analyse machine translation systems across their historical development",
      "Evaluate multilingual AI tools critically and practically",
      "Apply localisation principles in professional contexts",
      "Critically assess linguistic and cultural implications of AI in language work",
    ],
    modules: [
      { code: "M1", name: "Foundations of Natural Language Processing", topics: "Language & computation · Linguistic data · Core NLP tasks · Language resources" },
      { code: "M2", name: "History of Machine Translation", topics: "Rule-based systems · Statistical MT · Neural MT · Contemporary developments" },
      { code: "M3", name: "Neural Machine Translation", topics: "Transformer architectures · Translation quality · Evaluation metrics · Post-editing" },
      { code: "M4", name: "Large Language Models and Multilingual AI", topics: "LLM architectures · Cross-lingual capabilities · Multilingual prompting · Language generation" },
      { code: "M5", name: "Localisation and Multilingual Communication", topics: "Localisation workflows · Cultural adaptation · Accessibility · Global communication" },
      { code: "M6", name: "Ethics, Bias, and the Future of Language Technologies", topics: "Linguistic bias · Low-resource languages · Inclusion & accessibility · Future directions" },
    ],
    applications: [
      "Analysis of NLP and MT systems",
      "Multilingual AI evaluation report",
      "CAT tool workflows in Trados Studio",
      "Post-editing & localisation projects in Trados Studio",
    ],
  },
];

export function AiTrainingDetail() {
  const levels = TRAINING_LEVELS;

  return (
    <>
      <section className="wo-section">
        <div className="wo-container">
          <Link href="/services" className="back-link" aria-label="Back to services">
            ← All services
          </Link>

          <header className="header">
            <span className="service-icon" aria-hidden="true">◈</span>
            <h1>Human-Centered AI Literacy Training Series</h1>
            <p className="positioning">A progressive, six-level series from primary education to language technology specialisation.</p>
            <div className="langs">
              <span className="wo-tag">EN</span>
              <span className="wo-tag">FR</span>
              <span className="wo-tag">RO</span>
            </div>
          </header>

          <div className="overview">
            <p className="overview__desc">
              A progressive, six-level series equipping learners from primary school to professional research with the knowledge, critical thinking, and ethical awareness to understand, evaluate, and use artificial intelligence responsibly.
            </p>
            <div className="overview__info">
              <div className="info-card info-card--teal">
                <p className="info-card__label">Flexible Enrolment</p>
                <p>Each level is available as a <strong>standalone course</strong> and can be opted for independently. Participants may enrol in whichever level best matches their context and needs. All courses are delivered <strong>online</strong>.</p>
              </div>
              <div className="info-card info-card--pink">
                <p className="info-card__label">Certificate of Completion</p>
                <p>A <strong>certificate of completion</strong> is awarded at the end of every level, recognising the participant&apos;s achievement upon successfully completing the course requirements.</p>
              </div>
            </div>
          </div>

          <div className="levels">
            {levels.map((lvl) => (
              <div
                key={lvl.num}
                className={`level-card ${lvl.accentClass}`}
              >
                <div className="level-card__head">
                  <div className="level-head-row">
                    <span className="level-num" aria-hidden="true">{lvl.num}</span>
                    <div className="level-head-text">
                      <p className="level-eyebrow">{lvl.eyebrow}</p>
                      <h2 className="level-title">Human-Centered AI: {lvl.title}</h2>
                      <p className="level-audience">{lvl.audience}</p>
                    </div>
                  </div>
                  <div className="level-badges">
                    <span className="level-badge-pill">✓ Standalone course available</span>
                    <span className="level-badge-pill">Certificate of completion</span>
                  </div>
                </div>

                <div className="level-card__vision">
                  <span className="vision-label">Programme Vision</span>
                  <p className="vision-text">&quot;{lvl.vision}&quot;</p>
                </div>

                <div className="level-card__body">
                  <div className="block">
                    <h3 className="block-title">Learning Objectives</h3>
                    <ul className="obj-list">
                      {lvl.objectives.map((obj) => (
                        <li key={obj}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="block">
                    <h3 className="block-title">Modules</h3>
                    <ul className="mod-list">
                      {lvl.modules.map((mod) => (
                        <li key={mod.code} className="mod-item">
                          <span className="mod-code">{mod.code}</span>
                          <div>
                            <p className="mod-name">{mod.name}</p>
                            <p className="mod-topics">{mod.topics}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="level-card__apps">
                  <span className="apps-label">Applications</span>
                  <div className="apps-tags">
                    {lvl.applications.map((app) => (
                      <span key={app} className="app-tag">{app}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  );
}
