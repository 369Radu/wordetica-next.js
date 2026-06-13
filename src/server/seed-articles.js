import { getFirebaseApp } from "./firebase.js";
import { findUserByEmail } from "./repositories/usersRepository.js";
import { createArticle } from "./repositories/articlesRepository.js";

const ARTICLES = [
  {
    title: "Why AI Literacy Starts with Language",
    language: "en",
    status: "published",
    published_at: "2026-05-12",
    category: "teaching-learning-age-of-ai",
    subcategory: "human-centered-edtech-genai-agentic-ai",
    author_name: "Andreea Ghița",
    metadata_title: "Why AI Literacy Starts with Language | Wordetica",
    metadata_description:
      "Before we can teach people to use AI responsibly, we need to teach them to read it critically. A linguist's case for language-first AI literacy.",
    metadata_image: "",
    image: "",
    content: `<h2>The problem with most AI literacy programmes</h2>
<p>Most AI literacy initiatives focus on tools. They teach people how to write prompts, how to fact-check outputs, how to use specific platforms. These are valuable skills. But they miss something more fundamental: the ability to read AI-generated text the way a linguist reads it.</p>
<p>AI systems produce language. That language is not neutral. It carries assumptions, hedges uncertainty in specific ways, collapses nuance, and sometimes sounds more authoritative than it should. Understanding these patterns is not a technical skill — it is a language skill.</p>
<h2>What linguistic expertise adds to AI literacy</h2>
<p>A linguist trained on discourse analysis, pragmatics, and text typology brings a different lens to AI outputs than a software engineer or a policy specialist. They notice:</p>
<ul>
  <li>When a text sounds fluent but is semantically thin;</li>
  <li>When hedging language is used to avoid commitment rather than reflect genuine uncertainty;</li>
  <li>When a culturally specific frame has been applied to content that should remain culturally neutral;</li>
  <li>When register is inconsistent — a sign that multiple training sources have been blended without coherent editing.</li>
</ul>
<p>These are not edge cases. They are characteristic features of current large language model outputs, and recognising them is the foundation of critical AI use.</p>
<h2>From consumers to critical readers</h2>
<p>The goal of a language-first AI literacy programme is not to make people suspicious of AI. It is to make them <strong>better readers</strong> — readers who can engage with AI-generated content the same way they would engage with any text: asking who produced it, for what purpose, with what assumptions, and in what context.</p>
<p>At Wordetica, this principle shapes every level of our <em>Human-Centered AI Literacy Training Series</em>. Whether we are working with primary school learners, university students, or professionals, we begin with language awareness before we introduce AI tools. The tools change. The capacity to read critically does not.</p>
<h2>A practical framework</h2>
<p>A language-first approach to AI literacy involves three core competencies:</p>
<ul>
  <li><strong>Textual awareness</strong> — recognising the structural and stylistic features of AI-generated text;</li>
  <li><strong>Pragmatic reading</strong> — understanding what a text is doing, not just what it is saying;</li>
  <li><strong>Critical evaluation</strong> — assessing the reliability, appropriateness, and cultural sensitivity of AI outputs in context.</li>
</ul>
<p>These competencies are transferable across tools, platforms, and subject areas. They are also deeply human — and that is precisely the point.</p>`,
  },

  {
    title: "L'IA et la traduction : défis et responsabilités",
    language: "fr",
    status: "published",
    published_at: "2026-05-28",
    category: "localization-age-of-ai",
    subcategory: "ai-assisted-translation-localization",
    author_name: "Andreea Ghița",
    metadata_title: "L'IA et la traduction : défis et responsabilités | Wordetica",
    metadata_description:
      "La traduction automatique a considérablement progressé, mais les décisions humaines restent au cœur d'une localisation de qualité. Une réflexion sur le rôle du traducteur à l'ère de l'IA.",
    metadata_image: "",
    image: "",
    content: `<h2>Une révolution technique, pas une révolution du sens</h2>
<p>Les systèmes de traduction automatique neuronale ont transformé le secteur de la traduction professionnelle à une vitesse que peu d'experts avaient anticipée. En moins d'une décennie, la qualité brute des sorties machine a progressé au point où, dans certains paires de langues et certains domaines, les résultats sont difficiles à distinguer d'une traduction humaine au premier coup d'œil.</p>
<p>Mais la traduction n'est pas une question de première impression. C'est une question de sens, de contexte, de responsabilité.</p>
<h2>Ce que la machine ne comprend pas</h2>
<p>Un système de traduction automatique opère sur des probabilités statistiques établies à partir de grandes quantités de textes parallèles. Il prédit le segment le plus probable, pas nécessairement le plus juste. Cette distinction est fondamentale dans des contextes où l'exactitude n'est pas seulement souhaitable mais obligatoire :</p>
<ul>
  <li>Les textes juridiques, où une nuance terminologique peut avoir des conséquences contractuelles ;</li>
  <li>Les textes médicaux, où une ambiguïté peut affecter la sécurité des patients ;</li>
  <li>Les communications institutionnelles, où le registre et la culture organisationnelle doivent être rigoureusement respectés ;</li>
  <li>Les textes littéraires ou créatifs, où le style est lui-même porteur de sens.</li>
</ul>
<p>Dans ces contextes, le post-editing — la révision humaine d'une traduction automatique — n'est pas une option de confort. C'est une nécessité professionnelle.</p>
<h2>Le rôle central du traducteur humain</h2>
<p>La montée en puissance de la traduction automatique ne rend pas le traducteur humain obsolète. Elle redéfinit son rôle. Aujourd'hui, un traducteur professionnel doit être capable de :</p>
<ul>
  <li>Évaluer la qualité d'une sortie machine avec un œil critique et méthodique ;</li>
  <li>Identifier les erreurs de sens invisibles à première lecture ;</li>
  <li>Comprendre les biais inhérents aux modèles de traduction selon les domaines et les paires de langues ;</li>
  <li>Prendre des décisions éthiques concernant l'utilisation de l'IA dans des contextes sensibles.</li>
</ul>
<p>Ces compétences ne s'apprennent pas en utilisant un outil de traduction. Elles s'acquièrent par une formation linguistique solide, une pratique réflexive, et une compréhension de l'architecture des systèmes d'IA.</p>
<h2>Notre approche chez Wordetica</h2>
<p>Chez Wordetica, nous intégrons les outils d'IA dans nos flux de traduction de manière <strong>sélective et transparente</strong>. Nous n'utilisons la traduction automatique que lorsqu'elle apporte une valeur réelle au projet — en termes de rapidité, de cohérence terminologique, ou de volume — et toujours sous supervision humaine experte.</p>
<p>Nous pensons que la traduction responsable à l'ère de l'IA repose sur un principe simple : <em>la technologie doit amplifier le jugement humain, pas le remplacer.</em></p>`,
  },

  {
    title: "Neurodiversity and AI: Designing Inclusive Learning Environments",
    language: "en",
    status: "published",
    published_at: "2026-06-03",
    category: "neurodiversity-inclusion-age-of-ai",
    subcategory: "neurodiversity-ai-enhanced-learning",
    author_name: "Andreea Ghița",
    metadata_title: "Neurodiversity and AI: Designing Inclusive Learning Environments | Wordetica",
    metadata_description:
      "AI tools can dramatically improve access to learning for neurodiverse learners — but only when they are designed with those learners in mind, not as an afterthought.",
    metadata_image: "",
    image: "",
    content: `<h2>The promise and the risk</h2>
<p>Artificial intelligence offers genuine opportunities for neurodiverse learners. Text-to-speech, speech-to-text, adaptive pacing, automatic summarisation, visual structuring of information — many of the features that neuroscience and educational research have long identified as beneficial for learners with dyslexia, ADHD, autism spectrum conditions, and other profiles are now embedded in mainstream AI tools.</p>
<p>But opportunity and access are not the same thing. A tool that is not designed with neurodiversity in mind — even if it is technically accessible — may create additional barriers rather than removing them.</p>
<h2>What inclusive design actually means</h2>
<p>Inclusive design is not about adding an accessibility layer at the end of a development process. It is about asking, from the very beginning, who will use this tool, in what contexts, with what needs, and with what constraints.</p>
<p>For neurodiverse learners, this means considering:</p>
<ul>
  <li><strong>Cognitive load</strong> — AI interfaces that generate large volumes of text rapidly can be overwhelming for learners with attention or processing differences;</li>
  <li><strong>Predictability</strong> — Many autistic learners benefit from consistent, predictable interactions. AI systems that vary their tone, structure, or response length unpredictably can create anxiety;</li>
  <li><strong>Multimodal output</strong> — Learners with dyslexia may process audio or visual information more effectively than dense text. Tools that offer genuine multimodal flexibility, not just visual formatting, make a significant difference;</li>
  <li><strong>Control and agency</strong> — Neurodiverse learners often benefit from greater control over pacing, repetition, and the level of scaffolding they receive. AI tools that are rigid or that assume a single correct path through content are less effective.</li>
</ul>
<h2>Language as an accessibility issue</h2>
<p>One dimension of AI-assisted learning that is often overlooked is language itself. AI-generated content tends toward a certain register: moderately formal, moderately abstract, structured in ways that reflect the dominant patterns in its training data. For learners who process language differently, this default register may not be the most accessible.</p>
<p>Adapting language complexity, sentence length, paragraph structure, and the use of concrete versus abstract vocabulary are not cosmetic choices. They are fundamental to comprehension and engagement for many neurodiverse learners. At Wordetica, our approach to AI literacy and language coaching always incorporates an explicit attention to <strong>linguistic accessibility</strong> — adapting how we communicate, not just what we communicate.</p>
<h2>Moving from accommodation to design</h2>
<p>The most significant shift in thinking about neurodiversity and AI is moving from a model of <em>accommodation</em> (adapting existing tools for learners who struggle with them) to a model of <em>universal design</em> (creating tools that work better for everyone because they were designed with diverse needs in mind).</p>
<p>Research consistently shows that features designed for neurodiverse learners — clear structure, reduced cognitive load, multimodal presentation, flexible pacing — improve outcomes for all learners. The argument for inclusive design is not only ethical. It is pedagogical.</p>`,
  },

  {
    title: "Gândire critică în era AI: De ce contează cum scriem întrebările",
    language: "ro",
    status: "published",
    published_at: "2026-06-09",
    category: "academic-writing-research-age-of-ai",
    subcategory: "scholarly-writing-academic-communication",
    author_name: "Andreea Ghița",
    metadata_title: "Gândire critică în era AI: De ce contează cum scriem întrebările | Wordetica",
    metadata_description:
      "Un prompt bine formulat nu este o comandă tehnică — este un act de gândire. O perspectivă lingvistică asupra scrierii academice asistate de AI.",
    metadata_image: "",
    image: "",
    content: `<h2>Prompting ca act lingvistic</h2>
<p>Există o tendință de a trata prompting-ul — formularea instrucțiunilor pentru un sistem de inteligență artificială — ca pe o competență tehnică. Se vorbește despre „tehnici de prompting", despre „ingineria promptului", despre structuri optimale și formule dovedite. Această perspectivă nu este greșită, dar este incompletă.</p>
<p>Un prompt este, înainte de orice, un act lingvistic. Este o formulare a unei intenții în limbaj natural. Iar calitatea sa depinde nu de cunoașterea unui sistem de AI, ci de claritatea gândirii celui care îl scrie.</p>
<h2>Ce dezvăluie un prompt slab</h2>
<p>Când un student sau un cercetător primește un răspuns nesatisfăcător de la un model de limbaj, reacția instinctivă este deseori să reformuleze promptul tehnic — să adauge instrucțiuni mai precise, să modifice structura cererii. Uneori, aceasta este soluția corectă. Dar de multe ori, problema este mai profundă: întrebarea în sine nu era suficient de bine gândită.</p>
<p>Un prompt slab reflectă, de obicei, unul dintre următoarele:</p>
<ul>
  <li><strong>Ambiguitate conceptuală</strong> — autorul nu a clarificat ce vrea să afle sau să obțină;</li>
  <li><strong>Lipsă de context</strong> — sistemul nu are informațiile necesare pentru a genera un răspuns relevant;</li>
  <li><strong>Așteptări implicite neverificate</strong> — autorul presupune că sistemul înțelege un cadru teoretic sau disciplinar care nu a fost formulat explicit;</li>
  <li><strong>Confuzie între scop și metodă</strong> — autorul cere o metodă (redactează un paragraf argumentativ) fără să fi clarificat scopul (care este argumentul pe care vrea să îl dezvolte).</li>
</ul>
<h2>Scrisul academic și AI: o relație de colaborare, nu de delegare</h2>
<p>Utilizarea inteligentă a AI în scrierea academică presupune că autorul uman rămâne responsabil de gândire. AI-ul poate ajuta la structurarea ideilor, la identificarea lacunelor argumentative, la îmbunătățirea clarității expresiei sau la verificarea consistenței terminologice. Nu poate — și nu ar trebui să — înlocuiască procesul prin care un cercetător își formulează propriile argumente.</p>
<p>Aceasta înseamnă că, înainte de a deschide un model de limbaj, un cercetător sau student trebuie să fie capabil să răspundă la câteva întrebări fundamentale:</p>
<ul>
  <li>Ce vreau să comunic în această secțiune?</li>
  <li>Cui mă adresez și ce știe deja publicul meu?</li>
  <li>Care este relația logică dintre ideile pe care vreau să le exprim?</li>
  <li>Ce parte din acest proces aș putea externaliza unui instrument AI fără a pierde controlul asupra argumentului meu?</li>
</ul>
<h2>O competență pentru toate disciplinele</h2>
<p>Gândirea critică aplicată la utilizarea AI nu este o competență rezervată lingviștilor sau specialiștilor în comunicare. Este o competență transversală, relevantă în orice domeniu academic sau profesional în care scrisul este un instrument de cunoaștere și de comunicare.</p>
<p>La Wordetica, integrăm această perspectivă în programele noastre de coaching lingvistic și în seria de formare în domeniul alfabetizării AI. Credem că <em>a ști să scrii o întrebare bună</em> este una dintre cele mai valoroase competențe pe care le poate dezvolta un profesionist sau un cercetător în contextul actual.</p>`,
  },
];

async function seedArticles() {
  getFirebaseApp();

  const author = await findUserByEmail("office@wordetica.eu");
  if (!author) {
    console.error("[seed-articles] Admin user not found. Run `npm run seed` first.");
    process.exit(1);
  }

  console.log(`[seed-articles] Using author id=${author.id} (${author.email})`);

  for (const article of ARTICLES) {
    const id = await createArticle(article, author.id);
    console.log(`[seed-articles] Created article id=${id}: "${article.title}"`);
  }

  console.log("[seed-articles] Done.");
}

seedArticles().catch((err) => {
  console.error(err);
  process.exit(1);
});
