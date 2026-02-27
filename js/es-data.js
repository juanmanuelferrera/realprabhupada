/**
 * es-data.js — Spanish translations overlay for SITE_DATA
 *
 * Loaded AFTER data.js on Spanish pages.
 * Replaces faqItems, debunkingMyths, psychologicalProfile, and videoEvidence
 * with their Spanish translations.
 *
 * Proper names, book titles, video numbers, URLs, and verbatim English quotes
 * are preserved as-is. Only narrative/analytical text is translated.
 */
(function () {
  'use strict';
  var data = window.SITE_DATA;
  if (!data) return;


  // ---------------------------------------------------------------------------
  // 1. FAQ ITEMS — Preguntas frecuentes
  // ---------------------------------------------------------------------------
  data.faqItems = [
    {
      question: '¿Quién cambió los libros de Prabhupada?',
      answer: 'El Bhaktivedanta Book Trust (BBT), específicamente bajo la dirección de Jayadvaita Swami, publicó ediciones revisadas de varios libros de Prabhupada después de su partida en 1977. La revisión más significativa fue la edición de 1983 del Bhagavad Gita As It Is.'
    },
    {
      question: '¿Prabhupada autorizó los cambios?',
      answer: 'No existe evidencia documentada de que Prabhupada autorizara una revisión póstuma de su Bhagavad Gita terminado. Aunque Prabhupada ocasionalmente corregía errores específicos cuando se los señalaban, esto es fundamentalmente diferente a autorizar una revisión completa de una obra publicada.'
    },
    {
      question: '¿Cuántos cambios se hicieron?',
      answer: '541 de los 700 versos (77%) del Bhagavad Gita fueron alterados. BookChanges.com documenta más de 5.000 cambios individuales solo en el Gita. 496 de 625 significados y 483 de 653 traducciones fueron modificados. La biografía Lilamrta tiene más de 1.108 cambios documentados.'
    },
    {
      question: '¿Dónde puedo conseguir los libros originales?',
      answer: 'Las ediciones originales están disponibles en múltiples fuentes: Léelos en línea en PrabhupadaBooks.com y AsItIs.com. Compra copias físicas en KrishnaStore.com o Krishna Books Inc. Descarga PDFs gratuitos en Krishna.org y Prabhupada-Media.net. El Vedabase original está disponible en Krishna.org.'
    },
    {
      question: '¿Cómo puedo verificar los cambios yo mismo?',
      answer: 'Usa GitaDiff (gitadiff.pages.dev) para explorar comparaciones verso por verso de manera interactiva, o visita la comparación en DiffChecker para ver una diferencia completa del texto. BookChanges.com proporciona documentación detallada de cada cambio con análisis.'
    },
    {
      question: '¿Las dos ediciones producen un efecto diferente en el lector?',
      answer: 'Sí. Las dos ediciones son, en efecto, dos libros diferentes. La edición original de 1972 transmite la voz de Prabhupada directamente: sus elecciones específicas de palabras, su énfasis, su forma de presentar la conciencia de Krishna al mundo occidental. La edición revisada filtra esa voz a través de la interpretación de otro editor sobre lo que Prabhupada "realmente quiso decir". Como se documenta en Stolen Words: The Literary Crime of the Century, muchos cambios no son meramente editoriales sino que alteran la sustancia filosófica: términos clave son sustituidos, oraciones son reestructuradas y, en algunos casos, se agrega contenido completamente nuevo que Prabhupada nunca escribió. El resultado acumulativo es que el lector de la edición revisada recibe un mensaje filosófico sutil pero sistemáticamente diferente, moldeado por las decisiones interpretativas del editor en lugar de por las propias palabras del autor. El lector de la edición original recibe a Prabhupada. El lector de la revisión recibe a Prabhupada reinterpretado por Jayadvaita Swami.'
    },
    {
      question: '¿Por qué es tan importante educar a la gente sobre esto?',
      answer: 'Se han distribuido más de 12 millones de copias del Bhagavad Gita modificado, en comparación con solo unos 4 millones de copias de la edición original Macmillan de 1972. La mayoría de las personas hoy en día no tienen idea de que existen dos ediciones completamente diferentes. Creen que solo hay un Bhagavad Gita As It Is, cuando en realidad el libro que están leyendo puede contener más de 5.000 alteraciones no autorizadas. Sin educación y concientización, la edición original \u2014la que Prabhupada supervisó y aprobó personalmente\u2014 corre el riesgo de ser olvidada por completo, reemplazada por una versión que él nunca autorizó.'
    },
    {
      question: '¿Cómo puedo ayudar?',
      answer: 'Distribuye libros originales, comparte los recursos de este sitio, únete a la comunidad de Reddit en r/PrabhupadaAsItIs y apoya a organizaciones como Krishna Books Inc. y Vedic Vault que preservan y distribuyen ediciones originales.'
    }
  ];


  // ---------------------------------------------------------------------------
  // 2. DEBUNKING MYTHS — Desmintiendo mitos
  // ---------------------------------------------------------------------------
  data.debunkingMyths = [
    {
      myth: 'Los cambios son menores y no afectan el significado',
      fact: 'GitaDiff documenta 541 de 700 versos alterados \u2014eso es el 77% del Bhagavad Gita completo. BookChanges.com registra más de 5.000 cambios individuales. 496 de 625 significados y 483 de 653 traducciones fueron modificados.',
      source: 'GitaDiff (gitadiff.pages.dev), BookChanges.com'
    },
    {
      myth: 'Prabhupada aprobó las revisiones',
      fact: 'Prabhupada nunca aprobó una revisión póstuma de su Bhagavad Gita. La edición revisada de 1983 fue publicada seis años después de su partida en 1977. Nunca se ha presentado ninguna carta, conversación o documento que demuestre que Prabhupada autorizó una revisión futura de la edición completa Macmillan de 1972.',
      source: 'Arsa Prayoga, Chapter 3: "Did Prabhupada Want Changes?"'
    },
    {
      myth: 'Los editores mejoraron la calidad literaria',
      fact: 'Muchos cambios alteran el significado filosófico, no solo la gramática. Se agregaron, eliminaron y sustituyeron palabras de maneras que cambian el mensaje intencionado de Prabhupada. La edición original fue revisada y aprobada por el propio Prabhupada.',
      source: 'Stolen Words: The Literary Crime of the Century'
    },
    {
      myth: 'Las revisiones son necesarias para nuevos lectores',
      fact: 'La edición original Macmillan de 1972 vendió millones de copias y fue la edición que el propio Prabhupada utilizó para enseñar. Los lectores que descubrieron la conciencia de Krishna a través de la edición original la encontraron perfectamente clara y accesible.',
      source: 'Historical sales records, testimonies from original readers'
    },
    {
      myth: 'Esto es solo una diferencia de opinión',
      fact: 'Esto no es una cuestión de opinión. Es una cuestión de cambios textuales documentados y verificables en la obra de un autor publicado, hechos después de su muerte, sin su autorización. Los cambios pueden ser verificados por cualquier persona usando GitaDiff o el DiffChecker.',
      source: 'GitaDiff (gitadiff.pages.dev), DiffChecker'
    },
    {
      myth: 'El editor volvió a los manuscritos originales de Prabhupada',
      fact: 'Jayadvaita Swami afirma que restauró lo que Prabhupada "realmente dictó" consultando las cintas y manuscritos originales, insinuando que la edición Macmillan de 1972 fue un intermediario defectuoso. Pero los manuscritos eran borradores de trabajo, no el producto terminado. Prabhupada revisó, corrigió y aprobó personalmente la edición publicada de 1972 como su versión final. La publicación aprobada por un autor tiene precedencia sobre los borradores anteriores. Ninguna editorial en el mundo revertiría un libro publicado a su forma de borrador y lo llamaría una mejora.',
      source: 'Arsa Prayoga, Chapter 4; Prabhupada\'s letters regarding the Macmillan edition'
    },
    {
      myth: 'Prabhupada se quejó de errores en sus libros',
      fact: 'Prabhupada ocasionalmente mencionó errores: erratas, faltas de ortografía y problemas de impresión. Nunca pidió ni autorizó una reedición sistemática del contenido filosófico, las traducciones o los significados de su Bhagavad Gita. Corregir un error tipográfico y reescribir el 77% de los versos son dos cosas completamente diferentes. El BBTi confunde estos conceptos para fabricar consentimiento para una revisión que Prabhupada nunca solicitó.',
      source: 'Arsa Prayoga, Chapter 3; Prabhupada\'s letters on printing errors vs. the scope of the 1983 revision'
    },
    {
      myth: 'Hayagriva cometió errores que necesitaban corrección',
      fact: 'Culpar al editor original, Hayagriva Dasa, desvía la responsabilidad del verdadero problema: Prabhupada supervisó personalmente la edición de 1972 y aprobó el resultado final. Cualesquiera que hayan sido las decisiones editoriales de Hayagriva, Prabhupada revisó el libro publicado y lo aceptó como propio. La aprobación del autor es la palabra final. Anular póstumamente esa aprobación culpando a un editor fallecido que no puede defenderse no es ni ético ni honesto.',
      source: 'Arsa Prayoga; Prabhupada\'s recorded approval of the 1972 Macmillan edition'
    },
    {
      myth: 'Prabhupada dijo que "editores responsables" deberían corregir sus libros',
      fact: 'Esta cita está sacada de contexto. En la conversación citada (27 de febrero de 1977), Prabhupada estaba hablando de errores tipográficos y gramaticales específicos, no autorizando una revisión completa futura de sus obras terminadas. También declaró explícitamente: "The next printing should be again to the original way." El BBTi usa un fragmento para justificar algo que Prabhupada nunca pretendió. Leer la conversación completa en contexto hace que la instrucción real sea inconfundible.',
      source: 'Room conversation, February 27, 1977, Mayapur; Arsa Prayoga, Chapter 3'
    },
    {
      myth: 'La edición revisada es más fiel al sánscrito',
      fact: 'Las traducciones de Prabhupada no eran ejercicios académicos: eran sus propias interpretaciones devocionales deliberadas, informadas por la sucesión discipular (parampara). Él eligió palabras específicas en inglés para transmitir significados filosóficos específicos. Reemplazar sus palabras elegidas con traducciones sánscritas "más precisas" impone el juicio académico del editor por encima del entendimiento realizado del acarya. El propio Prabhupada advirtió contra esto: el significado debe llegar a través del parampara, no a través de la interpretación académica.',
      source: 'Prabhupada\'s preface to Bhagavad Gita As It Is; Arsa Prayoga, Chapter 5'
    },
    {
      myth: 'El BBT tiene el derecho legal de editar los libros',
      fact: 'La propiedad legal de los derechos de autor no equivale a autorización espiritual. Una corporación puede poseer legalmente los derechos de un texto, pero eso no hace que las alteraciones póstumas sean moral o espiritualmente legítimas. Prabhupada estableció el BBT para imprimir y distribuir sus libros, no para reescribirlos. El principio vaishnava de arsa prayoga sostiene que las palabras del acarya deben preservarse tal como fueron dadas, no "mejoradas" por quienes vinieron después. La autoridad corporativa no puede anular los deseos explícitos del autor.',
      source: 'BBT Trust Document; Arsa Prayoga, Chapter 6; Vaishnava literary tradition'
    },
    {
      myth: 'El propio Prabhupada cambió el Gita entre ediciones',
      fact: 'El BBTi señala las diferencias entre la edición abreviada Macmillan de 1968 y la edición completa de 1972 como evidencia de que "Prabhupada también revisó". Esto es profundamente engañoso. La edición de 1968 era una versión abreviada con solo versos seleccionados. La edición de 1972 fue la obra completa e íntegra que Prabhupada supervisó personalmente como su edición definitiva. Un autor que amplía su propia obra durante su vida no es lo mismo que un editor que reescribe el libro terminado después de la muerte del autor.',
      source: 'Publishing history of Bhagavad Gita As It Is (1968 vs. 1972 editions); Arsa Prayoga'
    }
  ];


  // ---------------------------------------------------------------------------
  // 3. PSYCHOLOGICAL PROFILE — Perfil psicológico
  // ---------------------------------------------------------------------------
  data.psychologicalProfile = {
    title: 'Perfil psicológico de los editores y defensores de la revisión del Bhagavad Gita',
    intro: 'Las siguientes observaciones se extraen exclusivamente de los argumentos de Jayadvaita Swami y otros a lo largo de los 19 videos de esta serie. No son diagnósticos clínicos sino patrones de comportamiento que cualquier lector atento puede verificar.',
    image: 'assets/images/psychological-profile.jpg',
    imageAlt: 'The Book Changers: Jayadvaita Swami, Dravida Dasa, Gopiparanadhana Dasa, Hari Sauri Dasa, Kesava Bharati Dasa, Sacinandana Swami, Svavasa Dasa, Vaisesika Dasa',
    patterns: [
      {
        id: 1,
        title: 'Grandiosidad disfrazada de humildad',
        text: 'En el Video 12, cuando a Kesava Bharati Dasa (condenado por el propio ISKCON como abusador de menores) se le pregunta qué edición está más cerca de la intención de Prabhupada, su respuesta es: él personalmente "hears Prabhupada\'s intention more clearly" en su propia revisión, y "feels empowered and enlivened." Esto no es un argumento editorial. Es una pretensión de percepción espiritual privilegiada. Está diciendo, en efecto, que puede percibir lo que Prabhupada realmente quiso decir mejor de lo que el propio texto publicado de Prabhupada lo comunica. En el Video 9, Gopiparanadhana Dasa va más lejos: "the second edition is more original than the first." La persona que revisó el libro declara su revisión más auténtica que la propia edición del autor. Esto es grandiosidad presentada como servicio devocional.'
      },
      {
        id: 2,
        title: 'Desprecio por el predecesor',
        text: 'Todo el proyecto de revisión se basa en una premisa no declarada: que Hayagriva, el editor original de Prabhupada, hizo un mal trabajo. En el Video 9, Gopiparanadhana Dasa describe a Hayagriva como alguien que "crossed out what he couldn\'t decipher." En el Video 17, Hari Sauri Dasa explica el proceso editorial inicial como inadecuado, con Prabhupada teniendo que dejar su trabajo "in the hands of his disciples" porque "he didn\'t have time" para revisarlo. En el Video 19, el desprecio de Jayadvaita Swami se vuelve explícito: "The Blessed Lord" se atribuye directamente a Hayagriva por nombre, como si identificar la fuente fuera suficiente para deslegitimar la frase. La implicación es consistente: el trabajo editorial original era deficiente, y solo el editor actual puede corregirlo. Lo que nunca se reconoce es que Prabhupada utilizó el producto del trabajo de Hayagriva durante cinco años sin exigir una revisión. El desprecio por el predecesor es el motor emocional que impulsa el proyecto. Durante la mayor parte de la serie permanece implícito, pero en el Video 19 de Jayadvaita sale a la superficie abiertamente: Hayagriva es nombrado, culpado y anulado.'
      },
      {
        id: 3,
        title: 'Inversión de la responsabilidad',
        text: 'Un patrón consistente a lo largo de los videos es la inversión de quién debe justificar qué. En el Video 7, el editor ofrece "change it back if evidence arises," como si el texto original aprobado por el autor ahora debiera demostrar su validez frente a la revisión. En el Video 4, quienes objetan los cambios son caracterizados como teóricos de la conspiración. En el Video 14, los defensores del texto original son llamados "fanatics." La persona que alteró el 77% del libro de un autor fallecido se posiciona como el moderado razonable, mientras que quienes dicen "no cambien la obra publicada del autor" son los extremistas. Esta inversión de la responsabilidad es psicológicamente reveladora: es la postura de alguien que sabe que su posición es difícil de defender y, por lo tanto, debe desacreditar preventivamente a quienes la cuestionan.'
      },
      {
        id: 4,
        title: 'Autoridad sin límites',
        text: 'En el Video 11, su argumento es explícito: "editors by definition revise." Ser nombrado editor, en su opinión, constituye una autorización general para revisiones ilimitadas a perpetuidad, incluso después de la muerte del autor. En el Video 5, el argumento se extiende aún más: dado que Prabhupada "never told them to stop editing," el mandato editorial es eterno. En el Video 15, la aceptación por parte de Prabhupada de correcciones tipográficas menores al Primer Canto se extrapola como autorización para revisar 541 versos del Bhagavad Gita. El patrón es de expansión progresiva: una autorización específica y limitada se estira para cubrir un alcance ilimitado. Este es el comportamiento de alguien que ha asumido autoridad y luego busca justificación retroactivamente, no de alguien que recibió un mandato claro y lo está ejecutando.'
      },
      {
        id: 5,
        title: 'Incapacidad para distinguirse del autor',
        text: 'En el Video 12, el editor declara que su revisión "feels empowered." En el Video 9, declara que es "more original than the first." En el Video 8, cambios que alteran el significado se defienden como "restoration of Prabhupada\'s original intention." A lo largo de toda la serie, no hay un momento de duda, ningún reconocimiento de que la percepción del editor sobre la intención de Prabhupada podría diferir de la intención real de Prabhupada. El Video 19 proporciona la formulación más reveladora: "I felt justified in restoring it." No "la evidencia lo requería". No "el manuscrito lo exigía". Él se sintió justificado. La base para cambiar un texto sagrado es un sentimiento personal. El límite entre lo que el editor cree que Prabhupada quiso decir y lo que Prabhupada realmente publicó se ha derrumbado. Esto es fusión psicológica: el editor se ha identificado tan completamente con su rol que ya no puede distinguir sus propias preferencias editoriales de la voz del autor. Cuando cambia un verso, genuinamente cree que está restaurando a Prabhupada. La posibilidad de que se esté sustituyendo a sí mismo por Prabhupada no parece ocurrírsele.'
      },
      {
        id: 6,
        title: 'Minimización como mecanismo de defensa',
        text: 'En el Video 1, los 5.000 cambios se desestiman como "not impressive" porque incluyen puntuación. En el Video 4, Vaisesika Dasa dice que el cambio en BG 4.34 es "not particularly" problemático. En el Video 7, el cambio de Visnu form/Visnu platform es "either way." Cada cambio individual se presenta como trivial cuando se examina de forma aislada. Pero 541 versos no es trivial. La minimización sistemática de los cambios individuales sirve para impedir que el oyente perciba el efecto acumulativo. Este es un mecanismo de defensa psicológica bien documentado: si cada ladrillo es insignificante, el muro que forman de alguna manera no existe.'
      },
      {
        id: 7,
        title: 'Deflexión mediante encuadre emocional',
        text: 'Cuando se enfrentan a críticas sustantivas, la respuesta a lo largo de estos videos es consistentemente emocional en lugar de probatoria. En el Video 8, la pregunta retórica es "how dare you" \u2014dirigida no al editor por cambiar el texto, sino a los críticos por objetar. En el Video 14, los críticos son caracterizados como personas que "shoot off in some direction" y son "totally unreasonable." En el Video 5, abordar la evidencia textual se descarta como "nitpicking." El patrón es desviar la discusión de la evidencia (qué se cambió, por qué y si coincide con el manuscrito) hacia la emoción (lealtad, fe, empoderamiento, fanatismo). Este es el comportamiento de alguien que no puede ganar el argumento probatorio y, por lo tanto, se niega a tenerlo.'
      },
      {
        id: 8,
        title: 'Vaguedad donde se necesita precisión',
        text: 'En el Video 16, cuando se le pregunta sobre la autoridad para la revisión, la respuesta es notablemente imprecisa: "I could see a document where Srila Prabhupada said..." pero lo que dice el documento nunca se especifica. Describe haber enviado "some paper or documentation" y titubea: "I don\'t want to say manuscript." Recuerda "a paper or letter or... whatever it was." Para alguien que defiende la intervención editorial más significativa en la historia de su tradición, la incapacidad o falta de voluntad para citar documentos específicos con precisión es reveladora. O bien la evidencia que autoriza no existe en la forma alegada, o el editor no ha sentido la necesidad de verificarla cuidadosamente, porque la decisión se tomó por otros motivos y la documentación se invoca como justificación a posteriori.'
      },
      {
        id: 9,
        title: 'La psicología del hecho consumado',
        text: 'Quizás la observación más importante es estructural más que específica de cualquier video individual. La revisión fue completada y publicada hace décadas. Cada argumento en esta serie es una defensa de un hecho consumado, no una propuesta de acción futura. Esto moldea fundamentalmente la psicología: el editor no está pidiendo permiso. Está explicando por qué lo que ya hizo fue correcto. Esto crea un imperativo psicológico de justificar a toda costa, porque admitir que la revisión fue no autorizada o infiel requeriría confrontar décadas de identidad invertida. Los argumentos no necesitan ser lógicamente rigurosos porque su función no es persuadir mediante la lógica. Su función es proporcionar suficiente cobertura retórica para que el editor y sus seguidores puedan seguir creyendo en la legitimidad de lo que ya se hizo.'
      },
      {
        id: 10,
        title: 'Imprecisión teológica disfrazada de rigor académico',
        text: 'En el Video 19, Jayadvaita critica a Gita Press por usar términos impersonales como "Paramatma" y "Parabrahma" y coloca "Blessed Lord" en la misma categoría. Esta confusión es teológicamente analfabeta. "Blessed Lord" es un término devocional y personal: transmite adoración, soberanía y gracia. Es lo opuesto del impersonal "Parabrahma." La incapacidad o falta de voluntad para distinguir entre una forma de tratamiento personal reverencial y una abstracción filosófica impersonal sugiere que la objeción del editor a "Blessed Lord" no es teológica en absoluto. Es territorial: Hayagriva eligió la frase, por lo tanto debe desaparecer. El argumento teológico se construye después para racionalizar lo que es fundamentalmente un acto de desplazamiento.'
      }
    ],
    summary: 'Lo que emerge de estos 19 videos no es el retrato de académicos cuidadosos defendiendo su trabajo con evidencia. Es el retrato de personas que tomaron una decisión trascendental hace décadas, identificaron toda su identidad espiritual con esa decisión, y ahora experimentan cualquier cuestionamiento a la revisión como un cuestionamiento a su propia legitimidad. Los argumentos no se construyen desde la evidencia hacia una conclusión. Comienzan con la conclusión \u2014que la revisión fue correcta\u2014 y trabajan hacia atrás para encontrar justificaciones. Esto explica por qué los argumentos son inconsistentes (el original es lo suficientemente deficiente como para requerir una revisión completa y lo suficientemente sagrado como para invocar la autoridad de Prabhupada), por qué los críticos son desestimados en lugar de abordados, y por qué impresiones subjetivas de "empoderamiento" se ofrecen como evidencia junto con afirmaciones procedimentales sobre autoridad institucional. Estos no son los argumentos de alguien que busca la verdad. Son los argumentos de alguien que defiende una posición que se ha vuelto inseparable de su sentido del yo.'
  };


  // ---------------------------------------------------------------------------
  // 4. VIDEO EVIDENCE — Evidencia en video
  // ---------------------------------------------------------------------------
  data.videoEvidence = [
    {
      id: 1,
      title: '¿Por qué 5.000 cambios?',
      quotes: [
        { text: 'The number doesn\'t impress me', url: 'https://www.youtube.com/watch?v=jBQoYoridyU&t=79' }
      ]
    },
    {
      id: 4,
      title: '¿Tiene usted algún problema con el cambio en BG 4.34?',
      quotes: [
        { text: 'Not particularly... unless one thinks there\'s a conspiracy', url: 'https://www.youtube.com/watch?v=Y-dt0Pv8eR4&t=18' }
      ]
    },
    {
      id: 5,
      title: '¿Es apropiado editar los libros de Prabhupada después de su partida?',
      quotes: [
        { text: 'I\'m convinced that certain disciples are empowered to edit his books', url: 'https://www.youtube.com/watch?v=8kupWFJuyvQ&t=172' },
        { text: 'He never told them to stop editing', url: 'https://www.youtube.com/watch?v=8kupWFJuyvQ&t=184' },
        { text: 'Better than nitpicking about what\'s original', url: 'https://www.youtube.com/watch?v=8kupWFJuyvQ&t=302' }
      ]
    },
    {
      id: 7,
      title: '¿Por qué cambió \'Visnu form\' a \'Visnu platform\'?',
      quotes: [
        { text: 'Either way', url: 'https://www.youtube.com/watch?v=9m76vZd1rGA&t=24' },
        { text: 'It\'s not sacred, it\'s not that serious', url: 'https://www.youtube.com/watch?v=9m76vZd1rGA&t=43' },
        { text: 'What kind of principle is that?', url: 'https://www.youtube.com/watch?v=9m76vZd1rGA&t=94' }
      ]
    },
    {
      id: 8,
      title: '¿Por qué algunos cambios alteran seriamente el significado?',
      quotes: [
        { text: 'Is that terrible? Is it sinful?', url: 'https://www.youtube.com/watch?v=3lp8t5AG1vA&t=42' },
        { text: 'How dare you?', url: 'https://www.youtube.com/watch?v=3lp8t5AG1vA&t=48' }
      ]
    },
    {
      id: 9,
      title: '¿Por qué editar un libro ya editado y aprobado?',
      quotes: [
        { text: 'Hayagriva simply crossed it out with a black marker', url: 'https://www.youtube.com/watch?v=7Px-W57nt4Y&t=53' },
        { text: 'The original is what comes from Prabhupada\'s mouth, not what was published', url: 'https://www.youtube.com/watch?v=7Px-W57nt4Y&t=123' },
        { text: 'The second edition is more original than the first', url: 'https://www.youtube.com/watch?v=7Px-W57nt4Y&t=143' }
      ]
    },
    {
      id: 11,
      title: 'Prabhupada se opuso a los cambios. ¿Por qué cambiar?',
      quotes: [
        { text: 'For practically ten years my prescribed duty was to change', url: 'https://www.youtube.com/watch?v=OX2X_o3OzGg&t=41' },
        { text: 'Editors are people who by definition revise', url: 'https://www.youtube.com/watch?v=OX2X_o3OzGg&t=62' },
        { text: 'Somehow Prabhupada trusted me', url: 'https://www.youtube.com/watch?v=OX2X_o3OzGg&t=95' }
      ]
    },
    {
      id: 12,
      title: '¿Qué edición considera más cercana a la intención de Prabhupada?',
      quotes: [
        { text: 'What I see is Prabhupada\'s intention more clearly', url: 'https://www.youtube.com/watch?v=ff9PZ4cA7oM&t=17' },
        { text: 'I hear his intention and that gives me faith... it\'s empowered', url: 'https://www.youtube.com/watch?v=ff9PZ4cA7oM&t=37' },
        { text: 'The second edition is empowered', url: 'https://www.youtube.com/watch?v=ff9PZ4cA7oM&t=51' }
      ]
    },
    {
      id: 13,
      title: '¿Por qué añadió al significado de BG 4.34?',
      quotes: [
        { text: 'It\'s not my fault, that\'s what Prabhupada said', url: 'https://www.youtube.com/watch?v=I8x2qtx_6t4&t=19' },
        { text: 'It\'s common sense', url: 'https://www.youtube.com/watch?v=I8x2qtx_6t4&t=44' }
      ]
    },
    {
      id: 14,
      title: '¿No deberíamos simplemente ser fieles y leales a Prabhupada?',
      quotes: [
        { text: 'Devotees become fanatics about preserving errors', url: 'https://www.youtube.com/watch?v=RlPqHhmitTo&t=34' },
        { text: 'They make a big mistake themselves', url: 'https://www.youtube.com/watch?v=RlPqHhmitTo&t=76' },
        { text: 'They shoot off in some direction... it\'s totally unreasonable', url: 'https://www.youtube.com/watch?v=RlPqHhmitTo&t=92' }
      ]
    },
    {
      id: 15,
      title: '¿Tiene el BBT autoridad para correcciones póstumas?',
      quotes: [
        { text: 'The authority comes from Prabhupada\'s desire that his books be free of errors', url: 'https://www.youtube.com/watch?v=l3AAi9LxjJQ&t=17' },
        { text: 'Prabhupada accepted them without seeing them', url: 'https://www.youtube.com/watch?v=l3AAi9LxjJQ&t=62' },
        { text: 'The idea that the books were frozen is fallacious', url: 'https://www.youtube.com/watch?v=l3AAi9LxjJQ&t=108' }
      ]
    },
    {
      id: 16,
      title: '¿Con qué autoridad Jayadvaita Swami reeditó el Gita?',
      quotes: [
        { text: 'I could see a document where Srila Prabhupada said...', url: 'https://www.youtube.com/watch?v=lrqpR_tF6ns&t=18' },
        { text: 'Whatever it was, a paper or letter or... I don\'t want to say manuscript', url: 'https://www.youtube.com/watch?v=lrqpR_tF6ns&t=54' }
      ]
    },
    {
      id: 17,
      title: '¿Prabhupada aprobó toda la edición?',
      quotes: [
        { text: 'Even the best writers need a good editor, Srila Prabhupada included', url: 'https://www.youtube.com/watch?v=uQiA_70ny5I&t=25' },
        { text: 'He didn\'t look at it again... he didn\'t have time', url: 'https://www.youtube.com/watch?v=uQiA_70ny5I&t=70' },
        { text: 'He knew there were going to be some mistakes', url: 'https://www.youtube.com/watch?v=uQiA_70ny5I&t=98' }
      ]
    },
    {
      id: 19,
      title: '¿Por qué cambió \'The Blessed Lord said\'?',
      quotes: [
        { text: 'Full video', url: 'https://www.youtube.com/watch?v=rpV54tfQ_O8' }
      ],
      spanishUrl: 'https://www.facebook.com/vaisnavasdeespana/posts/pfbid031ouaB9ro8eoTiTa1q91dqxwRxTVAwBqqufte3Bn3YR5VzUsjoSSumasoVfJFuZVJl'
    }
  ];

})();
