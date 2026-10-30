(() => {
  const CHANNELS = [
    { id: "harbor", name: "Harbor Notes", color: "#1e3a5f", verified: true, subs: "1.2M" },
    { id: "loft", name: "Loft Desk", color: "#8a4b32", verified: false, subs: "640K" },
    { id: "glass", name: "Glasshouse", color: "#1d4ed8", verified: true, subs: "3.4M" },
    { id: "current", name: "Deep Current", color: "#c2410c", verified: true, subs: "890K" },
    { id: "kettle", name: "Kettle Club", color: "#0f766e", verified: true, subs: "12M" },
    { id: "stage", name: "Open Stage", color: "#7c2d12", verified: true, subs: "5.1M" },
    { id: "field", name: "Field Notes", color: "#3f6212", verified: false, subs: "210K" },
    { id: "kiln", name: "Kiln & Co", color: "#9a3412", verified: true, subs: "402K" },
    { id: "tari", name: "Tari Okoye", color: "#292524", verified: false, subs: "18" },
  ];

  const LADDER = [
    { id: "2160p", bitrate: "18 Mbps", codec: "AV1", width: 3840 },
    { id: "1440p", bitrate: "10 Mbps", codec: "AV1", width: 2560 },
    { id: "1080p", bitrate: "5.8 Mbps", codec: "H.264", width: 1920 },
    { id: "720p", bitrate: "3.0 Mbps", codec: "H.264", width: 1280 },
    { id: "480p", bitrate: "1.4 Mbps", codec: "H.264", width: 854 },
    { id: "360p", bitrate: "0.8 Mbps", codec: "H.264", width: 640 },
    { id: "240p", bitrate: "0.4 Mbps", codec: "H.264", width: 426 },
    { id: "144p", bitrate: "0.15 Mbps", codec: "H.264", width: 256 },
  ];

  const REGIONS = [
    { id: "los", city: "Lagos", area: "West Africa", hit: 99.1, p95: 18, egress: "42 TB", x: 48, y: 58 },
    { id: "jnb", city: "Johannesburg", area: "Southern Africa", hit: 97.4, p95: 36, egress: "11 TB", x: 54, y: 76 },
    { id: "lhr", city: "London", area: "Europe", hit: 98.6, p95: 22, egress: "64 TB", x: 46, y: 32 },
    { id: "fra", city: "Frankfurt", area: "Europe", hit: 99.4, p95: 14, egress: "88 TB", x: 52, y: 36 },
    { id: "iad", city: "Ashburn", area: "North America", hit: 99.2, p95: 16, egress: "120 TB", x: 24, y: 40 },
    { id: "gru", city: "São Paulo", area: "South America", hit: 96.1, p95: 48, egress: "19 TB", x: 32, y: 70 },
    { id: "bom", city: "Mumbai", area: "South Asia", hit: 97.8, p95: 34, egress: "37 TB", x: 68, y: 50 },
    { id: "sin", city: "Singapore", area: "Southeast Asia", hit: 98.9, p95: 20, egress: "54 TB", x: 76, y: 62 },
    { id: "nrt", city: "Tokyo", area: "East Asia", hit: 99.0, p95: 19, egress: "61 TB", x: 84, y: 38 },
    { id: "syd", city: "Sydney", area: "Oceania", hit: 96.8, p95: 44, egress: "14 TB", x: 88, y: 78 },
  ];

  const CHIPS = ["All", "Live", "Music", "Deep House", "Chill-out", "Animation", "Stage", "Travel", "Focus", "Under 10 min"];

  const GUIDE = [
    { id: "home", label: "Home", icon: "home", group: "Watch" },
    { id: "shorts", label: "Shorts", icon: "shorts", group: "Watch" },
    { id: "subs", label: "Subscriptions", short: "Subs", icon: "subs", group: "Watch" },
    { id: "library", label: "Library", icon: "library", group: "Watch" },
    { id: "history", label: "History", icon: "history", group: "Watch" },
    { id: "upload", label: "Upload", icon: "upload", group: "Studio" },
    { id: "live", label: "Live desk", icon: "live", group: "Studio" },
    { id: "rank", label: "Ranking", icon: "rank", group: "Studio" },
    { id: "rights", label: "Copyright", icon: "shield", group: "Studio" },
    { id: "delivery", label: "Delivery", icon: "globe", group: "Studio" },
  ];

  const CHAT_LINES = [
    "the kick is soft enough to draw to",
    "staying for one more track",
    "watching from Abuja with the lamp on",
    "this mix doesn't rush",
    "headphones on, chat later",
    "the vocal chop at the top is the hook",
    "leaving this on while the rice finishes",
    "sound is clean on my side",
  ];

  const NAMES = ["Amaka", "Seyi", "Jonah", "Priya", "Hana", "Idris", "Leah", "Chuka", "Noor", "Mateo"];

  function video(row) {
    return Object.assign(
      {
        kind: "video",
        live: false,
        ended: false,
        likes: 1200,
        caption: "A line from the program.",
        description: "",
        topics: [],
      },
      row
    );
  }

  const state = {
    view: "home",
    expanded: false,
    chip: "All",
    query: "",
    channelFilter: null,
    videoId: "night-market",
    shortId: "short-whisk",
    playing: false,
    progressById: { "coast-road": 0.42, "rain-window": 0.18 },
    quality: "1080p",
    qualityOpen: false,
    captions: false,
    volume: 0.8,
    autoplay: true,
    bellOpen: false,
    subs: { harbor: true, loft: true, kettle: true, stage: true },
    saved: { glasshouse: true },
    liked: {},
    history: [
      { id: "rain-window", at: Date.now() - 1000 * 60 * 50 },
      { id: "coast-road", at: Date.now() - 1000 * 60 * 60 * 26 },
    ],
    weights: { history: 35, subs: 30, topic: 20, fresh: 10, diverse: 5 },
    ranked: false,
    region: "los",
    warming: null,
    notes: [
      { id: "n1", title: "Loft Desk is live", body: "late radio has been up for four hours.", view: "watch", video: "late-radio", unread: true },
      { id: "n2", title: "Copyright scan", body: "Blue hour still shares revenue with Glasshouse.", view: "rights", unread: true },
      { id: "n3", title: "Frankfurt shield", body: "Cache hit stayed above 99% overnight.", view: "delivery", unread: false },
    ],
    draft: "",
    chatDraft: "",
    disputeId: null,
    disputeDraft: "",
    extraComments: {},
    job: null,
    broadcast: {
      on: false,
      title: "Open hours — a quiet live desk",
      viewers: 0,
      peak: 0,
      bitrate: 0,
      dropped: 0,
      latency: 0,
      startedAt: 0,
      health: "idle",
      chat: [
        { name: "Leah", text: "Say when you're on.", mine: false },
      ],
      videoId: null,
    },
    rooms: {
      "late-radio": [
        { name: "Hana", text: "drawing along, don't change the lamp" },
        { name: "Idris", text: "four hours and the level is still even" },
      ],
      "dusk-set": [
        { name: "Noor", text: "the room is finally quiet" },
        { name: "Mateo", text: "leave this on" },
      ],
    },
    videos: [
      video({
        id: "night-market",
        order: 1,
        title: "Night Market Sessions 2026 — vocals and deep house for a late walk",
        channelId: "harbor",
        views: 1700000,
        age: "1 month ago",
        ageDays: 32,
        duration: 3738,
        category: "Music",
        topics: ["music", "deep house"],
        art: "night",
        likes: 48200,
        caption: "Lanterns first. The vocal waits until the second stall.",
        description: "A full night of vocal deep house recorded around the market stalls. Songs play through. Nothing is cut in for an ad break.",
      }),
      video({
        id: "late-radio",
        order: 2,
        title: "late radio — beats to draw and study to",
        channelId: "loft",
        views: 0,
        watching: 28400,
        age: "Live",
        ageDays: 0,
        duration: 0,
        category: "Music",
        topics: ["music", "chill"],
        art: "loft",
        live: true,
        likes: 2100,
        caption: "Side A is still the lamp and the soft kick.",
        description: "An open-ended loft mix. It stays up while people draw, read, and leave the tab running.",
      }),
      video({
        id: "glasshouse",
        order: 3,
        title: "Glasshouse — the full record, 2024",
        channelId: "glass",
        views: 2100000,
        age: "3 weeks ago",
        ageDays: 21,
        duration: 4442,
        category: "Music",
        topics: ["music"],
        art: "album",
        likes: 91000,
        caption: "Track four, Blue Hour, starts with the piano alone.",
        description: "The 2024 record in order: eight songs, no interview in between. Blue Hour is the one other videos keep matching.",
      }),
      video({
        id: "dusk-set",
        order: 4,
        title: "House at dusk — a long set for an empty room",
        channelId: "current",
        views: 0,
        watching: 1340,
        age: "Live",
        ageDays: 0,
        duration: 0,
        category: "Music",
        topics: ["music", "deep house"],
        art: "dusk",
        live: true,
        likes: 640,
        caption: "The sun is down. The kick stays.",
        description: "Deep Current plays a long house set with the window open. Viewers come and go; the mix does not restart.",
      }),
      video({
        id: "kettle-reel",
        order: 5,
        title: "Cat & Kettle — the full kettle reel",
        channelId: "kettle",
        views: 186000000,
        age: "1 year ago",
        ageDays: 370,
        duration: 11560,
        category: "Animation",
        topics: ["animation"],
        art: "cartoon",
        likes: 2400000,
        caption: "Kettle hides the cream. Cat finds the spoon.",
        description: "Every Cat & Kettle short in one reel, from the first whisk to the cream heist. Made for a long afternoon.",
      }),
      video({
        id: "gold-note",
        order: 6,
        title: "The gold note: Amira Bello stops the room",
        channelId: "stage",
        views: 8300000,
        age: "1 day ago",
        ageDays: 1,
        duration: 402,
        category: "Stage",
        topics: ["stage", "music"],
        art: "stage",
        likes: 510000,
        caption: "She holds the last note until the lights come up.",
        description: "Open Stage, evening batch. Amira Bello sings one verse unaccompanied. The room stays still until she lets the note go.",
      }),
      video({
        id: "rain-window",
        order: 7,
        title: "Rain on the window, two hours of quiet",
        channelId: "field",
        views: 902000,
        age: "2 months ago",
        ageDays: 64,
        duration: 7200,
        category: "Focus",
        topics: ["chill", "focus"],
        art: "rain",
        likes: 22000,
        caption: "Rain, then the radiator, then rain again.",
        description: "A fixed camera on a wet window. People leave it on to read. There is no host and no chapter marker.",
      }),
      video({
        id: "coast-road",
        order: 8,
        title: "Coast road, Lagos to Badagry — no talking",
        channelId: "field",
        views: 311000,
        age: "3 weeks ago",
        ageDays: 22,
        duration: 1458,
        category: "Travel",
        topics: ["travel"],
        art: "coast",
        likes: 8400,
        caption: "The road bends and the water stays on the left.",
        description: "One drive, no narration. The camera is fixed to the dash from the first toll to the last palm.",
      }),
      video({
        id: "primers",
        order: 9,
        title: "Deep house primers: kick, hat, and a vocal chop",
        channelId: "harbor",
        views: 88000,
        age: "4 days ago",
        ageDays: 4,
        duration: 845,
        category: "Music",
        topics: ["music", "deep house"],
        art: "keys",
        likes: 3100,
        caption: "Hat pattern first, then the chop from the night market tape.",
        description: "Harbor Notes opens a session: a kick, a hat, and one vocal chop from Night Market Sessions. The rest of the arrangement waits.",
      }),
      video({
        id: "blue-hour",
        order: 10,
        title: "Blue hour, played at home",
        channelId: "field",
        views: 64000,
        age: "6 days ago",
        ageDays: 6,
        duration: 252,
        category: "Music",
        topics: ["music"],
        art: "rain",
        likes: 980,
        caption: "The piano line is the one Glasshouse recorded.",
        description: "A home performance of Blue Hour. Kinora matched the piano to the Glasshouse master, and the revenue is shared.",
      }),
      video({
        id: "audition",
        order: 11,
        title: "Open Stage audition room, morning batch",
        channelId: "stage",
        views: 120000,
        age: "1 week ago",
        ageDays: 7,
        duration: 1124,
        category: "Stage",
        topics: ["stage"],
        art: "stage",
        likes: 4300,
        caption: "First singer, then a long pause while the next chair moves.",
        description: "The morning audition room, uncut between singers. Names are called from the corridor.",
      }),
      video({
        id: "side-b",
        order: 12,
        title: "Loft Desk archive — side B",
        channelId: "loft",
        views: 54000,
        age: "2 weeks ago",
        ageDays: 14,
        duration: 2480,
        category: "Music",
        topics: ["music", "chill"],
        art: "loft",
        likes: 1600,
        caption: "Side B starts with the window open.",
        description: "A saved loft recording from a Tuesday that never went live. Slower than the current radio.",
      }),
      video({
        id: "balogun",
        order: 13,
        title: "A walk through Balogun after dark",
        channelId: "harbor",
        views: 990000,
        age: "8 months ago",
        ageDays: 240,
        duration: 580,
        category: "Travel",
        topics: ["travel", "music"],
        art: "night",
        likes: 19400,
        caption: "Cloth stalls first, then the sound of a generator.",
        description: "Nine minutes through Balogun market after the shutters are half down. The recording is the walk, not a guide.",
      }),
      video({
        id: "jollof",
        order: 14,
        title: "One-pot jollof for a Tuesday",
        channelId: "kiln",
        views: 640000,
        age: "5 days ago",
        ageDays: 5,
        duration: 492,
        category: "Focus",
        topics: ["focus"],
        art: "jollof",
        likes: 28100,
        caption: "Tomato first, then the rice, then leave the lid on.",
        description: "Kiln & Co cooks one pot of jollof and stays with the lid. The clock on the wall is the only timer.",
      }),
      video({
        id: "short-whisk",
        kind: "short",
        order: 20,
        title: "The whisk spin",
        channelId: "kettle",
        views: 2400000,
        age: "6 days ago",
        ageDays: 6,
        duration: 18,
        category: "Animation",
        topics: ["animation"],
        art: "cartoon",
        likes: 180000,
        caption: "Whisk. Spin. Cream.",
        description: "Cat finds the whisk. Kettle hides the cream.",
      }),
      video({
        id: "short-chord",
        kind: "short",
        order: 21,
        title: "One chord, four moods",
        channelId: "harbor",
        views: 860000,
        age: "3 days ago",
        ageDays: 3,
        duration: 24,
        category: "Music",
        topics: ["music"],
        art: "keys",
        likes: 42000,
        caption: "Same chord, four lamps.",
        description: "Harbor Notes holds one chord and changes only the room tone.",
      }),
      video({
        id: "short-lamp",
        kind: "short",
        order: 22,
        title: "Lighting the market lamps",
        channelId: "harbor",
        views: 410000,
        age: "1 week ago",
        ageDays: 9,
        duration: 21,
        category: "Travel",
        topics: ["travel"],
        art: "night",
        likes: 19000,
        caption: "First lamp, then the string.",
        description: "A stall owner lights the string above the night market.",
      }),
      video({
        id: "short-pier",
        kind: "short",
        order: 23,
        title: "Last light on the pier",
        channelId: "current",
        views: 300000,
        age: "4 days ago",
        ageDays: 4,
        duration: 15,
        category: "Music",
        topics: ["deep house"],
        art: "dusk",
        likes: 12000,
        caption: "The set keeps going after the sun.",
        description: "A few seconds of the dusk set as the pier goes dark.",
      }),
      video({
        id: "short-note",
        kind: "short",
        order: 24,
        title: "The note, held",
        channelId: "stage",
        views: 5200000,
        age: "1 day ago",
        ageDays: 1,
        duration: 19,
        category: "Stage",
        topics: ["stage"],
        art: "stage",
        likes: 640000,
        caption: "She doesn't drop it.",
        description: "The last seconds of Amira Bello's gold note.",
      }),
      video({
        id: "short-rain",
        kind: "short",
        order: 25,
        title: "Rain, thirty seconds",
        channelId: "field",
        views: 770000,
        age: "2 weeks ago",
        ageDays: 15,
        duration: 30,
        category: "Focus",
        topics: ["focus", "chill"],
        art: "rain",
        likes: 25000,
        caption: "Just the glass.",
        description: "A short cut of the window recording.",
      }),
      video({
        id: "short-steam",
        kind: "short",
        order: 26,
        title: "Lift the lid",
        channelId: "kiln",
        views: 990000,
        age: "5 days ago",
        ageDays: 5,
        duration: 12,
        category: "Focus",
        topics: ["focus"],
        art: "jollof",
        likes: 61000,
        caption: "Steam, then the rice.",
        description: "The moment the jollof lid comes off.",
      }),
      video({
        id: "short-coast",
        kind: "short",
        order: 27,
        title: "The bend in the coast road",
        channelId: "field",
        views: 150000,
        age: "3 weeks ago",
        ageDays: 20,
        duration: 16,
        category: "Travel",
        topics: ["travel"],
        art: "coast",
        likes: 4300,
        caption: "Water on the left.",
        description: "One bend between Lagos and Badagry.",
      }),
    ],
    claims: [
      {
        id: "c1",
        videoId: "blue-hour",
        asset: "Blue Hour",
        owner: "Glasshouse",
        score: 96,
        span: "0:18–3:02",
        status: "Active",
        policy: "Share revenue",
      },
      {
        id: "c2",
        videoId: "short-whisk",
        asset: "Kettle Club theme",
        owner: "Kettle Club",
        score: 88,
        span: "0:00–0:06",
        status: "Released",
        policy: "None",
      },
      {
        id: "c3",
        videoId: "audition",
        asset: "Open Stage bed",
        owner: "Open Stage",
        score: 91,
        span: "0:00–0:12",
        status: "Muted",
        policy: "Muted span",
      },
    ],
  };

  const COMMENTS = {
    "night-market": [
      { name: "Seyi Adeyemi", text: "The last track, after the stalls close, is the one I came back for.", time: "2 weeks ago", likes: 860 },
      { name: "Priya Raman", text: "Walked the long way home with this on. Didn't skip.", time: "5 days ago", likes: 214 },
    ],
    "late-radio": [
      { name: "Hana Ito", text: "Leaving the tab open while I ink a page.", time: "1 hour ago", likes: 46 },
    ],
    "glasshouse": [
      { name: "Jonah Briggs", text: "Blue Hour still hits harder in the middle of the record than on its own.", time: "1 week ago", likes: 1204 },
    ],
    "kettle-reel": [
      { name: "Chioma Eze", text: "The cream heist is around the two-hour mark. Worth the wait.", time: "3 months ago", likes: 9800 },
    ],
    "gold-note": [
      { name: "Amaka Bello", text: "Nobody in the room moved. You can hear a chair and then nothing.", time: "18 hours ago", likes: 6400 },
    ],
    "jollof": [
      { name: "Tunde Salami", text: "Lid stays on. That's the whole lesson.", time: "2 days ago", likes: 510 },
    ],
  };

  let toastTimer = 0;
  let chatBag = 0;

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function channel(id) {
    return CHANNELS.find((item) => item.id === id) || CHANNELS[0];
  }

  function videoById(id) {
    return state.videos.find((item) => item.id === id);
  }

  function compact(n) {
    const value = Math.round(Number(n) || 0);
    if (value >= 1000000) {
      const shown = value / 1000000;
      return (shown >= 10 ? shown.toFixed(0) : shown.toFixed(1)).replace(/\.0$/, "") + "M";
    }
    if (value >= 1000) {
      const shown = value / 1000;
      return (shown >= 10 ? shown.toFixed(0) : shown.toFixed(1)).replace(/\.0$/, "") + "K";
    }
    return String(value);
  }

  function formatTime(sec) {
    const safe = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;
    const pad = (n) => String(n).padStart(2, "0");
    if (h > 0) return h + ":" + pad(m) + ":" + pad(s);
    return m + ":" + pad(s);
  }

  function ago(ts) {
    const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
    if (mins < 2) return "Just now";
    if (mins < 60) return mins + " minutes ago";
    const hours = Math.round(mins / 60);
    if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
    const days = Math.round(hours / 24);
    return days + (days === 1 ? " day ago" : " days ago");
  }

  function formatBytes(bytes) {
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
    if (bytes >= 1e6) return Math.round(bytes / 1e6) + " MB";
    return Math.round(bytes / 1e3) + " KB";
  }

  function toast(message) {
    const el = document.querySelector("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function icon(name) {
    const s = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    const paths = {
      menu: `<path ${s} d="M4 7h16M4 12h16M4 17h16"/>`,
      search: `<circle ${s} cx="11" cy="11" r="6"/><path ${s} d="m16 16 4 4"/>`,
      mic: `<rect ${s} x="9" y="3" width="6" height="11" rx="3"/><path ${s} d="M6 11a6 6 0 0 0 12 0M12 17v3"/>`,
      bell: `<path ${s} d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path ${s} d="M10 19a2 2 0 0 0 4 0"/>`,
      upload: `<path ${s} d="M12 16V5M8 8l4-4 4 4"/><path ${s} d="M5 19h14"/>`,
      home: `<path ${s} d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1Z"/>`,
      shorts: `<rect ${s} x="7" y="3" width="10" height="18" rx="2"/><path fill="currentColor" d="M11 9.5v5l4-2.5-4-2.5Z"/>`,
      subs: `<rect ${s} x="3" y="6" width="12" height="12" rx="2"/><rect ${s} x="8" y="4" width="12" height="12" rx="2"/>`,
      library: `<path ${s} d="M5 4h4v16H5zM11 4h4v16h-4zM17 8h3v12h-3z"/>`,
      history: `<circle ${s} cx="12" cy="12" r="8"/><path ${s} d="M12 8v5l3 2"/>`,
      live: `<circle ${s} cx="12" cy="12" r="3"/><path ${s} d="M6.5 8a8 8 0 0 0 0 8M17.5 8a8 8 0 0 1 0 8"/>`,
      rank: `<path ${s} d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>`,
      shield: `<path ${s} d="M12 3 19 6v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6l7-3Z"/>`,
      globe: `<circle ${s} cx="12" cy="12" r="8"/><path ${s} d="M4 12h16M12 4c2.5 2.6 2.5 13 0 16M12 4c-2.5 2.6-2.5 13 0 16"/>`,
      play: `<path fill="currentColor" d="M8 5.2v13.6L19 12 8 5.2Z"/>`,
      pause: `<path fill="currentColor" d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/>`,
      thumb: `<path ${s} d="M8 11v8H5v-8h3Zm0 0 3.2-6.2A2 2 0 0 1 14.8 6H15v5h3.2a2 2 0 0 1 2 2.3l-.8 5A2 2 0 0 1 17.4 20H8"/>`,
      save: `<path ${s} d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z"/>`,
      cc: `<rect ${s} x="3" y="6" width="18" height="12" rx="2"/><path ${s} d="M8 12.5a2 2 0 1 1 0-2M14 12.5a2 2 0 1 1 0-2"/>`,
      gear: `<circle ${s} cx="12" cy="12" r="3"/><path ${s} d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.2 6.2l1.6 1.6M16.2 16.2l1.6 1.6M17.8 6.2l-1.6 1.6M7.8 16.2 6.2 17.8"/>`,
      full: `<path ${s} d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5"/>`,
      send: `<path ${s} d="M4 12 20 4l-6 16-2-6-8-2Z"/>`,
      close: `<path ${s} d="M6 6l12 12M18 6 6 18"/>`,
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  function mark() {
    return `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#171717"/><path d="M13 10.2v11.6L23 16l-10-5.8Z" fill="#ff7a1a"/></svg>`;
  }

  function verified() {
    return `<svg class="tick" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#737373"/><path d="M4.6 8.2 6.8 10.4 11.6 5.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  }

  function avatar(ch, small) {
    const letter = ch.name.slice(0, 1);
    return `<span class="mono-av${small ? " sm" : ""}" style="background:${ch.color}" aria-hidden="true">${escapeHtml(letter)}</span>`;
  }

  function svgOpen(id, body) {
    return `<svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;
  }

  function artwork(item) {
    const id = String(item.id).replace(/[^a-z0-9]/gi, "");
    const scenes = {
      night: `
        <defs><linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#141822"/><stop offset="60%" stop-color="#2a211c"/><stop offset="100%" stop-color="#100e0c"/></linearGradient></defs>
        <rect width="640" height="360" fill="url(#${id}sky)"/>
        <g fill="#1b2433"><rect x="36" y="78" width="42" height="140"/><rect x="92" y="46" width="62" height="172"/><rect x="168" y="96" width="36" height="122"/><rect x="430" y="58" width="74" height="160"/><rect x="516" y="92" width="48" height="126"/><rect x="574" y="40" width="36" height="178"/></g>
        <g fill="#f6c15b"><rect x="108" y="64" width="8" height="12"/><rect x="128" y="88" width="8" height="10"/><rect x="452" y="84" width="10" height="14"/><rect x="478" y="112" width="8" height="10"/><rect x="586" y="66" width="8" height="12"/></g>
        <path d="M0 230h640v130H0z" fill="#1a120e"/>
        <path d="M24 230l78-52h86l-24 52z" fill="#8c2f39"/>
        <path d="M190 230l64-42h96l-18 42z" fill="#c4552a"/>
        <path d="M360 230l54-38h78v38z" fill="#245c4a"/>
        <g fill="#f3d48a"><circle cx="78" cy="196" r="4"/><circle cx="112" cy="196" r="4"/><circle cx="146" cy="196" r="4"/><circle cx="230" cy="204" r="3.5"/><circle cx="262" cy="204" r="3.5"/><circle cx="294" cy="204" r="3.5"/></g>
        <g transform="translate(268 150)"><path d="M30 18c8-16 22-16 28 0 4 8 2 16-4 20 8 4 16 16 16 30v52H16V68c0-14 8-26 16-30-6-4-10-12-2-20z" fill="#1c1a19"/><circle cx="44" cy="30" r="14" fill="#e7c4a4"/><path d="M28 28c2-12 10-18 18-16 6 1 12 6 14 14-8-6-16-6-22-2-4 3-8 4-10 4z" fill="#f4e4c8"/><path d="M20 78h48l10 58H10z" fill="#241c19"/></g>
        <text x="28" y="322" fill="#fff" font-family="Plus Jakarta Sans, sans-serif" font-size="68" font-weight="800">2026</text>`,
      loft: `
        <rect width="640" height="360" fill="#e4c49a"/>
        <rect x="36" y="36" width="150" height="170" fill="#1c3144"/>
        <path d="M36 36h150v170H36z" fill="none" stroke="#d7b48a" stroke-width="10"/>
        <path d="M111 36v170M36 121h150" stroke="#d7b48a" stroke-width="8"/>
        <rect x="400" y="70" width="70" height="46" fill="#f4e2b0"/>
        <path d="M392 70h86L470 210H360z" fill="#f6d48a" opacity="0.55"/>
        <rect x="250" y="250" width="280" height="18" fill="#6b4226"/>
        <rect x="270" y="210" width="36" height="40" fill="#8c3d3d"/>
        <rect x="312" y="196" width="28" height="54" fill="#245c4a"/>
        <rect x="348" y="220" width="40" height="30" fill="#1d4ed8"/>
        <g transform="translate(150 150)"><circle cx="46" cy="36" r="28" fill="#2a211c"/><rect x="18" y="62" width="70" height="90" rx="16" fill="#2f6b4f"/><path d="M16 48c8-6 18-8 30-8s22 2 30 8" fill="none" stroke="#1c1a19" stroke-width="6"/><circle cx="18" cy="52" r="10" fill="#1c1a19"/><circle cx="74" cy="52" r="10" fill="#1c1a19"/></g>
        <circle cx="250" cy="250" r="18" fill="#6b8f71"/>`,
      album: `
        <rect width="360" height="360" fill="#172554"/>
        <text x="28" y="64" fill="#dbeafe" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="800">GLASSHOUSE</text>
        <g fill="#93c5fd" font-family="IBM Plex Mono, monospace" font-size="16">
          <text x="28" y="110">01  North glass</text>
          <text x="28" y="136">02  Late market</text>
          <text x="28" y="162">03  Kitchen demo</text>
          <text x="28" y="188" fill="#fff" font-weight="700">04  Blue Hour</text>
          <text x="28" y="214">05  Shield</text>
          <text x="28" y="240">06  Unlisted</text>
          <text x="28" y="266">07  Edge</text>
          <text x="28" y="292">08  After the stall</text>
        </g>
        <rect x="360" width="280" height="360" fill="#0b1220"/>
        <path d="M500 0 L640 80 V360 H430 L500 0Z" fill="#f59e0b" opacity="0.85"/>
        <circle cx="500" cy="150" r="36" fill="#f3d5b5"/>
        <path d="M470 150c6-28 18-40 32-40 16 0 28 14 32 36-12-10-24-12-34-8-8 4-18 8-30 12z" fill="#1c1917"/>
        <path d="M456 200h90l18 160h-130z" fill="#111827"/>
        <rect x="548" y="168" width="8" height="120" fill="#e7e5e4"/>
        <circle cx="552" cy="160" r="16" fill="#d6d3d1"/>`,
      dusk: `
        <defs><linearGradient id="${id}dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="45%" stop-color="#fb923c"/><stop offset="100%" stop-color="#312e81"/></linearGradient></defs>
        <rect width="640" height="360" fill="url(#${id}dusk)"/>
        <circle cx="470" cy="120" r="42" fill="#fde68a"/>
        <path d="M0 230 C160 190 280 250 420 210 C520 186 580 200 640 180 V360 H0Z" fill="#1e1b4b"/>
        <path d="M0 250 C180 230 300 280 640 230 V360 H0Z" fill="#0f172a" opacity="0.45"/>
        <rect x="70" y="214" width="220" height="8" fill="#451a03"/>
        <circle cx="250" cy="206" r="22" fill="#1c1917"/>
        <rect x="238" y="226" width="24" height="40" fill="#1c1917"/>
        <text x="36" y="150" fill="#fff" font-family="Plus Jakarta Sans, sans-serif" font-size="64" font-weight="800" letter-spacing="4">DUSK</text>
        <text x="36" y="200" fill="#fff" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" letter-spacing="10">LONG SET</text>`,
      cartoon: `
        <rect width="640" height="360" fill="#8fd0c8"/>
        <rect y="250" width="640" height="110" fill="#f0d7a2"/>
        <ellipse cx="180" cy="210" rx="70" ry="48" fill="#f28c28"/>
        <circle cx="230" cy="170" r="36" fill="#f28c28"/>
        <circle cx="242" cy="166" r="5" fill="#1c1917"/>
        <path d="M214 188c10 8 24 8 34 0" fill="none" stroke="#9a3412" stroke-width="3"/>
        <path d="M200 150l-16-28 24 8z" fill="#f28c28"/>
        <ellipse cx="430" cy="200" rx="54" ry="40" fill="#3d5a80"/>
        <path d="M470 190c30 8 40 24 24 36" fill="none" stroke="#3d5a80" stroke-width="10"/>
        <circle cx="418" cy="192" r="4" fill="#fff"/>
        <rect x="300" y="214" width="28" height="36" rx="4" fill="#f8fafc"/>
        <rect x="336" y="220" width="24" height="30" rx="4" fill="#e2e8f0"/>
        <text x="28" y="58" fill="#134e4a" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="800">KETTLE CLUB</text>`,
      stage: `
        <rect width="640" height="360" fill="#1a1020"/>
        <circle cx="140" cy="70" r="40" fill="#fbbf24" opacity="0.35"/>
        <circle cx="520" cy="90" r="70" fill="#f59e0b" opacity="0.28"/>
        <path d="M0 0h90v360H0zM550 0h90v360h-90z" fill="#4a1830"/>
        <path d="M250 40h160l40 320H210z" fill="#f8d48a" opacity="0.18"/>
        <circle cx="330" cy="150" r="34" fill="#f3d5b5"/>
        <path d="M292 146c8-36 24-52 40-50 18 2 30 20 34 42-16-8-28-8-40-2-8 4-20 8-34 10z" fill="#f5f0e6"/>
        <path d="M286 196h92l16 120H270z" fill="#1c1917"/>
        <rect x="430" y="150" width="8" height="130" fill="#d6d3d1"/>
        <circle cx="434" cy="142" r="18" fill="#e7e5e4"/>
        <text x="28" y="46" fill="#fff" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="800" letter-spacing="2">OPEN STAGE</text>`,
      coast: `
        <rect width="640" height="360" fill="#d7ecf5"/>
        <path d="M0 120 C180 80 240 160 400 110 C500 80 560 90 640 70 V360 H0Z" fill="#17899a"/>
        <path d="M0 200 C200 160 280 230 640 170 V360 H0Z" fill="#e7d3a4"/>
        <path d="M-10 250 C120 210 200 280 340 240 C460 210 540 250 660 220" fill="none" stroke="#5c5346" stroke-width="18"/>
        <circle cx="250" cy="246" r="8" fill="#1c1917"/>
        <circle cx="520" cy="40" r="18" fill="#fde68a"/>`,
      rain: `
        <rect width="640" height="360" fill="#2a2622"/>
        <rect x="70" y="28" width="360" height="250" fill="#8aa0b2"/>
        <g stroke="#e5e7eb" stroke-width="2" opacity="0.7"><path d="M100 40l-16 48M150 60l-16 48M210 36l-16 48M270 70l-16 48M330 44l-16 48M390 66l-16 48"/></g>
        <rect x="430" y="150" width="70" height="40" fill="#f6d48a"/>
        <path d="M430 150h80L470 250h-70z" fill="#f6d48a" opacity="0.35"/>
        <rect x="120" y="250" width="200" height="16" fill="#44403c"/>
        <rect x="150" y="220" width="70" height="30" fill="#fafaf9"/>`,
      jollof: `
        <rect width="640" height="360" fill="#f3e6d4"/>
        <ellipse cx="320" cy="250" rx="180" ry="28" fill="#6b3a2a"/>
        <ellipse cx="320" cy="190" rx="110" ry="36" fill="#9a3412"/>
        <ellipse cx="320" cy="176" rx="90" ry="24" fill="#c2410c"/>
        <path d="M250 150c-10-40 20-70 10-90M320 140c0-40 20-60 8-88M380 150c12-36 0-70 16-92" fill="none" stroke="#e7e5e4" stroke-width="4"/>
        <rect x="430" y="150" width="90" height="12" rx="4" transform="rotate(30 430 150)" fill="#a16207"/>
        <circle cx="120" cy="80" r="28" fill="#166534"/>`,
      keys: `
        <rect width="640" height="360" fill="#1c1917"/>
        <g><rect x="40" y="80" width="70" height="220" fill="#fafaf9"/><rect x="120" y="80" width="70" height="220" fill="#fafaf9"/><rect x="200" y="80" width="70" height="220" fill="#fafaf9"/><rect x="280" y="80" width="70" height="220" fill="#fff7ed"/><rect x="360" y="80" width="70" height="220" fill="#fafaf9"/><rect x="440" y="80" width="70" height="220" fill="#fafaf9"/><rect x="520" y="80" width="70" height="220" fill="#fafaf9"/></g>
        <g fill="#1c1917"><rect x="96" y="80" width="36" height="130"/><rect x="176" y="80" width="36" height="130"/><rect x="336" y="80" width="36" height="130"/><rect x="416" y="80" width="36" height="130"/><rect x="496" y="80" width="36" height="130"/></g>`,
      desk: `
        <rect width="640" height="360" fill="#241c19"/>
        <rect x="70" y="48" width="340" height="190" rx="8" fill="#111827"/>
        <rect x="86" y="64" width="308" height="158" fill="#1d4ed8" opacity="0.35"/>
        <rect x="0" y="250" width="640" height="110" fill="#3f2e24"/>
        <rect x="430" y="150" width="90" height="60" rx="8" fill="#e7e5e4"/>
        <circle cx="475" cy="180" r="16" fill="#171717"/>
        <circle cx="180" cy="300" r="26" fill="#fafaf9"/>
        <rect x="168" y="300" width="24" height="30" fill="#fafaf9"/>`,
    };
    return svgOpen(item.id, scenes[item.art] || scenes.night);
  }

  function matchesChip(item, chip) {
    if (chip === "All") return true;
    if (chip === "Live") return item.live && !item.ended;
    if (chip === "Under 10 min") return item.duration > 0 && item.duration < 600;
    if (chip === "Music") return item.topics.includes("music");
    if (chip === "Deep House") return item.topics.includes("deep house");
    if (chip === "Chill-out") return item.topics.includes("chill");
    if (chip === "Animation") return item.category === "Animation";
    if (chip === "Stage") return item.category === "Stage";
    if (chip === "Travel") return item.category === "Travel";
    if (chip === "Focus") return item.category === "Focus";
    return true;
  }

  function matchesQuery(item) {
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const ch = channel(item.channelId);
    return (item.title + " " + ch.name + " " + item.category).toLowerCase().includes(q);
  }

  function longVideos() {
    let list = state.videos.filter((item) => item.kind !== "short");
    if (state.view === "home") {
      list = list.filter((item) => !item.visibility || item.visibility === "public");
      list = list.filter((item) => matchesChip(item, state.chip) && matchesQuery(item));
      if (state.channelFilter) list = list.filter((item) => item.channelId === state.channelFilter);
    }
    if (state.view === "subs") list = list.filter((item) => state.subs[item.channelId]);
    if (state.ranked && state.view === "home") {
      list = list
        .map((item) => ({ item, score: scoreVideo(item).total }))
        .sort((a, b) => b.score - a.score)
        .map((row) => row.item);
    } else {
      list = list.slice().sort((a, b) => a.order - b.order);
    }
    return list;
  }

  function scoreVideo(item) {
    const w = state.weights;
    const subs = state.subs[item.channelId] ? 1 : 0;
    const watched = state.history
      .map((row) => videoById(row.id))
      .filter(Boolean);
    const topics = new Set(watched.flatMap((row) => row.topics.concat(row.category.toLowerCase())));
    const history = topics.has(item.category.toLowerCase()) || item.topics.some((topic) => topics.has(topic)) ? 1 : 0.12;
    const fresh = Math.max(0, 1 - item.ageDays / 365);
    const last = watched[0];
    const diverse = last && last.channelId === item.channelId ? 0.15 : 1;
    const topic = state.chip !== "All" && matchesChip(item, state.chip) ? 1 : 0.45;
    const total = (w.history * history + w.subs * subs + w.topic * topic + w.fresh * fresh + w.diverse * diverse) / 100;
    return { total, history, subs, fresh, diverse, topic };
  }

  function explain(item, parts) {
    const bits = [];
    if (parts.subs > 0) bits.push("you subscribe");
    if (parts.history > 0.6) bits.push("close to what you watched");
    if (parts.fresh > 0.85) bits.push("new");
    if (item.live) bits.push("live now");
    if (!bits.length) bits.push(item.category.toLowerCase());
    return bits.slice(0, 2).join(" · ");
  }

  function regionById(id) {
    return REGIONS.find((item) => item.id === id) || REGIONS[0];
  }

  function edgeLine() {
    const region = regionById(state.region);
    if (state.warming === region.id) return "Warming the " + region.city + " edge";
    return "Playing " + state.quality + " from " + region.city + " · " + region.p95 + " ms";
  }

  function thumb(item) {
    const progress = state.progressById[item.id];
    const live = item.live && !item.ended;
    return `<div class="thumb">${artwork(item)}
      ${live ? `<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="live-flag">LIVE</span>` : `<span class="duration">${formatTime(item.duration)}</span>`}
      ${progress && !live ? `<span class="watched"><span style="width:${Math.round(progress * 100)}%"></span></span>` : ""}
    </div>`;
  }

  function card(item) {
    const ch = channel(item.channelId);
    const live = item.live && !item.ended;
    const meta = live
      ? `<p class="meta watching" data-watching="${item.id}">${compact(item.watching)} watching</p>`
      : `<p class="meta">${compact(item.views)} views · ${escapeHtml(item.age)}</p>`;
    return `<article><button class="card" type="button" data-act="watch" data-id="${item.id}">
      ${thumb(item)}
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="ch-row">${avatar(ch)}<div>
        <p class="ch-name">${escapeHtml(ch.name)}${ch.verified ? verified() : ""}</p>
        ${meta}
      </div></div>
    </button></article>`;
  }

  function shortsRow() {
    const shorts = state.videos.filter((item) => item.kind === "short");
    return `<section class="shorts-block">
      <div class="shorts-head"><span class="shorts-mark">${icon("play")}</span><h2>Shorts</h2></div>
      <div class="shorts-row">${shorts
        .map(
          (item) => `<button class="short" type="button" data-act="short" data-id="${item.id}">
            <div class="short-face">${artwork(item)}<p class="short-title">${escapeHtml(item.title)}</p></div>
          </button>`
        )
        .join("")}</div>
    </section>`;
  }

  function chips() {
    const filter = state.channelFilter ? channel(state.channelFilter) : null;
    return `<div class="chips" role="tablist" aria-label="Topics">${CHIPS.map(
      (chip) => `<button class="chip${chip === state.chip ? " on" : ""}" type="button" data-act="chip" data-chip="${escapeHtml(chip)}" role="tab" aria-selected="${chip === state.chip}">${escapeHtml(chip)}</button>`
    ).join("")}</div>${
      filter
        ? `<div class="channel-filter">Showing ${escapeHtml(filter.name)} <button class="btn ghost" type="button" data-act="clear-channel">Clear</button></div>`
        : ""
    }${state.ranked && state.view === "home" ? `<p class="hint">Home is using your ranking mix. <button class="btn line" type="button" data-act="go" data-view="rank">Adjust</button></p>` : ""}`;
  }

  function homeMain(list) {
    if (!list.length) {
      return `${chips()}<div class="empty"><p>Nothing matches that search.</p><button class="btn" type="button" data-act="clear-search">Clear search</button></div>`;
    }
    const showShorts = state.view === "home" && state.chip === "All" && !state.query && !state.channelFilter;
    const first = list.slice(0, 6).map(card).join("");
    const rest = list.slice(6).map(card).join("");
    return `<h1 class="sr-only">Home</h1>${chips()}<div class="grid">${first}</div>${showShorts ? shortsRow() : ""}<div class="grid">${rest}</div>`;
  }

  function qualityMenu() {
    if (!state.qualityOpen) return "";
    return `<div class="qmenu" role="menu">${LADDER.map(
      (item) => `<button type="button" class="${item.id === state.quality ? "on" : ""}" data-act="quality" data-quality="${item.id}" role="menuitem">${item.id}<small>${item.codec} · ${item.bitrate}</small></button>`
    ).join("")}</div>`;
  }

  function watchView() {
    const item = videoById(state.videoId) || longVideos()[0];
    if (!item) return `<div class="empty">Pick a video from home.</div>`;
    const ch = channel(item.channelId);
    const live = item.live && !item.ended;
    const claim = state.claims.find((row) => row.videoId === item.id && row.status !== "Released");
    const liked = !!state.liked[item.id];
    const saved = !!state.saved[item.id];
    const subscribed = !!state.subs[item.channelId];
    const elapsed = live ? item.watching : (state.progressById[item.id] || 0) * item.duration;
    const comments = (state.extraComments[item.id] || []).concat(COMMENTS[item.id] || []);
    const next = recommendations(item.id).slice(0, 8);
    const room = (state.rooms[item.id] || []).slice(-12);
    return `<div class="watch">
      <div>
        <div class="player" id="player">
          <div class="player-art">${artwork(item)}</div>
          <button class="player-hit" type="button" data-act="play" aria-label="${state.playing ? "Pause" : "Play"}"></button>
          ${state.playing ? "" : `<span class="big-play">${icon("play")}</span>`}
          ${state.captions ? `<p class="caption">${escapeHtml(item.caption)}</p>` : ""}
          ${live ? `<span class="live-flag" style="top:12px;bottom:auto">LIVE</span>` : ""}
          ${qualityMenu()}
          <div class="controls">
            ${live ? "" : `<input class="scrub" data-scrub type="range" min="0" max="1000" value="${Math.round((state.progressById[item.id] || 0) * 1000)}" aria-label="Seek" />`}
            <div class="cbar">
              <button class="ctrl" type="button" data-act="play" aria-label="${state.playing ? "Pause" : "Play"}">${icon(state.playing ? "pause" : "play")}</button>
              <span class="time-read"><span data-elapsed>${live ? compact(item.watching) + " watching" : formatTime(elapsed)}</span>${live ? "" : " / " + formatTime(item.duration)}</span>
              <input class="vol" type="range" min="0" max="1" step="0.05" value="${state.volume}" data-volume aria-label="Volume" />
              <button class="ctrl" type="button" data-act="cc" aria-pressed="${state.captions}" aria-label="Captions">${icon("cc")}</button>
              <button class="ctrl" type="button" data-act="quality-toggle" aria-label="Quality">${icon("gear")}</button>
              <button class="ctrl" type="button" data-act="full" aria-label="Full screen">${icon("full")}</button>
            </div>
          </div>
        </div>
        <p class="edge-line">${escapeHtml(edgeLine())}</p>
        <h1 class="v-title">${escapeHtml(item.title)}</h1>
        <div class="v-row">
          <button class="who" type="button" data-act="channel" data-id="${ch.id}">${avatar(ch)}<span><strong>${escapeHtml(ch.name)}${ch.verified ? verified() : ""}</strong><small>${escapeHtml(ch.subs)} subscribers</small></span></button>
          <button class="sub-btn${subscribed ? " on" : ""}" type="button" data-act="sub" data-id="${ch.id}">${subscribed ? "Subscribed" : "Subscribe"}</button>
          <div class="pills">
            <button class="pill${liked ? " on" : ""}" type="button" data-act="like" data-id="${item.id}">${icon("thumb")} <span>${compact(item.likes + (liked ? 1 : 0))}</span></button>
            <button class="pill${saved ? " on" : ""}" type="button" data-act="save" data-id="${item.id}">${icon("save")} ${saved ? "Saved" : "Save"}</button>
          </div>
        </div>
        ${claim ? `<div class="banner">Audio matched <strong>${escapeHtml(claim.asset)}</strong> by ${escapeHtml(claim.owner)} · ${claim.score}% · ${escapeHtml(claim.span)}. ${escapeHtml(claim.policy)}. <a href="#rights" data-act="go" data-view="rights">Open the claim</a></div>` : ""}
        <div class="desc"><strong>${live ? compact(item.watching) + " watching" : compact(item.views) + " views"} · ${escapeHtml(item.age)}</strong><p>${escapeHtml(item.description)}</p></div>
        ${live ? `<section class="comments"><h2>Live chat</h2><div class="chat-log" id="room-log">${room.map((line) => `<p class="chat-line"><b>${escapeHtml(line.name)}</b>${escapeHtml(line.text)}</p>`).join("")}</div>
          <form class="chat-form" data-form="room"><input name="text" placeholder="Say something" value="${escapeHtml(state.chatDraft)}" maxlength="140" aria-label="Chat message" /><button class="btn" type="submit">Send</button></form></section>` : `<section class="comments"><h2>${comments.length === 1 ? "1 comment" : comments.length + " comments"}</h2>
          <form class="comment-form" data-form="comment"><input name="text" placeholder="Add a comment" value="${escapeHtml(state.draft)}" maxlength="240" aria-label="Comment" /><button class="btn" type="submit">Comment</button></form>
          ${comments.map((row) => `<article class="comment">${avatar({ name: row.name, color: "#44403c" }, true)}<div><strong>${escapeHtml(row.name)}</strong> <span class="meta">${escapeHtml(row.time || "Just now")}</span><p>${escapeHtml(row.text)}</p></div></article>`).join("")}
        </section>`}
      </div>
      <aside>
        <div class="v-row" style="margin-top:0"><span class="hint" style="margin-right:auto">Up next</span><button class="btn ghost" type="button" data-act="autoplay">${state.autoplay ? "Autoplay on" : "Autoplay off"}</button></div>
        ${next
          .map((row) => {
            const parts = scoreVideo(row);
            return `<button class="rec" type="button" data-act="watch" data-id="${row.id}">${thumb(row)}<span><span class="rec-title">${escapeHtml(row.title)}</span><p class="why">${escapeHtml(channel(row.channelId).name)} · ${escapeHtml(explain(row, parts))}</p></span></button>`;
          })
          .join("")}
      </aside>
    </div>`;
  }

  function recommendations(exceptId) {
    return state.videos
      .filter((item) => item.kind !== "short" && item.id !== exceptId)
      .map((item) => ({ item, score: scoreVideo(item).total }))
      .sort((a, b) => b.score - a.score)
      .map((row) => row.item);
  }

  function shortsView() {
    const shorts = state.videos.filter((item) => item.kind === "short");
    const item = videoById(state.shortId) || shorts[0];
    const index = Math.max(0, shorts.findIndex((row) => row.id === item.id));
    const ch = channel(item.channelId);
    return `<div class="shorts-stage">
      <div class="phone">
        <div class="short-face">${artwork(item)}<p class="short-title">${escapeHtml(item.title)}</p><span class="duration">${formatTime(item.duration)}</span></div>
      </div>
      <div>
        <h1 class="v-title">${escapeHtml(item.title)}</h1>
        <p class="meta">${escapeHtml(ch.name)} · ${compact(item.views)} views</p>
      </div>
      <div class="short-tools">
        <button class="btn ghost" type="button" data-act="prev-short" ${index === 0 ? "disabled" : ""}>Previous</button>
        <button class="pill${state.liked[item.id] ? " on" : ""}" type="button" data-act="like" data-id="${item.id}">${icon("thumb")} ${compact(item.likes)}</button>
        <button class="btn" type="button" data-act="next-short">Next</button>
      </div>
    </div>`;
  }

  function subsView() {
    const cards = CHANNELS.filter((item) => item.id !== "tari")
      .map((item) => {
        const on = !!state.subs[item.id];
        return `<article class="channel-card">${avatar(item)}<div><strong>${escapeHtml(item.name)}</strong><p class="meta">${escapeHtml(item.subs)}</p></div><button class="sub-btn${on ? " on" : ""}" type="button" data-act="sub" data-id="${item.id}">${on ? "Subscribed" : "Subscribe"}</button></article>`;
      })
      .join("");
    const list = longVideos();
    return `<div class="studio-head"><p class="eyebrow">Subscriptions</p><h1>Channels Tari follows</h1></div><div class="channel-grid">${cards}</div>${
      list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No new videos from channels you follow. Subscribe from a card above.</div>`
    }`;
  }

  function libraryView() {
    const list = state.videos.filter((item) => state.saved[item.id]);
    return `<div class="studio-head"><p class="eyebrow">Library</p><h1>Saved to watch later</h1></div>${
      list.length
        ? `<div class="grid">${list.map(card).join("")}</div>`
        : `<div class="empty"><p>Nothing saved yet.</p><button class="btn" type="button" data-act="go" data-view="home">Browse home</button></div>`
    }`;
  }

  function historyView() {
    const rows = state.history
      .map((row) => {
        const item = videoById(row.id);
        if (!item) return "";
        const progress = state.progressById[item.id] || 0;
        return `<button class="hist" type="button" data-act="watch" data-id="${item.id}">${thumb(item)}<span><strong>${escapeHtml(item.title)}</strong><p class="meta">${escapeHtml(channel(item.channelId).name)} · ${Math.round(progress * 100)}% watched</p></span><span class="when meta">${ago(row.at)}</span></button>`;
      })
      .join("");
    return `<div class="studio-head"><p class="eyebrow">History</p><h1>What Tari has played</h1><div class="btn-row"><button class="btn line" type="button" data-act="clear-history" ${state.history.length ? "" : "disabled"}>Clear history</button></div></div>${
      rows || `<div class="empty">History is empty. Play a video and it will land here.</div>`
    }`;
  }

  function blankSteps() {
    const renditions = {};
    LADDER.forEach((item) => {
      renditions[item.id] = 0;
    });
    return { ingest: 0, inspect: 0, renditions, package: 0, thumbs: 0, captions: 0, scan: 0 };
  }

  function pipelineRows(job) {
    const rows = [
      ["Ingest", job.steps.ingest],
      ["Inspect", job.steps.inspect],
    ];
    LADDER.forEach((item) => rows.push([item.id + " · " + item.codec, job.steps.renditions[item.id]]));
    rows.push(["Package HLS + DASH", job.steps.package], ["Thumbnails", job.steps.thumbs], ["Captions", job.steps.captions], ["Copyright scan", job.steps.scan]);
    return `<div class="steps" id="pipeline">${rows
      .map(([label, value]) => {
        const done = value >= 100;
        return `<div class="step"><span>${escapeHtml(label)}</span><span class="bar${done ? " done" : ""}"><span style="width:${value}%"></span></span><em>${Math.round(value)}%</em></div>`;
      })
      .join("")}</div>${job.steps.package >= 100 ? `<pre class="manifest">#EXTM3U
#EXT-X-VERSION:6
#EXT-X-STREAM-INF:BANDWIDTH=5800000,RESOLUTION=1920x1080,CODECS="avc1.4d401f,mp4a.40.2"
1080p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8</pre>` : ""}`;
  }

  function uploadView() {
    const job = state.job;
    if (!job || job.stage === "pick") {
      return `<div class="studio-head"><p class="eyebrow">Upload</p><h1>Bring a master in</h1><p class="lede">Originals land here. Kinora builds a ladder of renditions, packages HLS and DASH, writes captions, and scans the audio before anything is public.</p></div>
        <div class="split">
          <div class="drop" id="drop"><strong>Drop a video</strong><span>Or choose a file from this computer. The bytes stay in the browser; this desk only reads the name and size.</span><div class="btn-row"><button class="btn" type="button" data-act="browse">Choose a file</button></div></div>
          <div class="choices">
            <button class="choice" type="button" data-act="sample" data-sample="clean"><strong>Clean master</strong><span>lagos-night-market.mov · 3.8 GB · 42:16 · ProRes. The scan should come back empty.</span></button>
            <button class="choice" type="button" data-act="sample" data-sample="claim"><strong>Cover with a sample</strong><span>blue-hour-at-home.mov · 860 MB · 4:12. The piano matches a Glasshouse master.</span></button>
          </div>
        </div>`;
    }
    if (job.stage === "details") {
      return `<div class="studio-head"><p class="eyebrow">Upload</p><h1>Details before the ladder</h1><p class="lede">${escapeHtml(job.fileName)} · ${escapeHtml(job.sizeLabel)} · ${escapeHtml(job.durationLabel)}</p></div>
        <form class="fields" data-form="details" style="max-width:720px">
          <label class="field"><span>Title</span><input name="title" value="${escapeHtml(job.title)}" required /></label>
          <label class="field"><span>Description</span><textarea name="description">${escapeHtml(job.description)}</textarea></label>
          <div class="row-2">
            <label class="field"><span>Visibility</span><select name="visibility"><option ${job.visibility === "public" ? "selected" : ""}>public</option><option ${job.visibility === "unlisted" ? "selected" : ""}>unlisted</option><option ${job.visibility === "private" ? "selected" : ""}>private</option></select></label>
            <label class="field"><span>Category</span><select name="category">${["Music", "Stage", "Travel", "Focus", "Animation"].map((cat) => `<option ${job.category === cat ? "selected" : ""}>${cat}</option>`).join("")}</select></label>
          </div>
          <div class="btn-row"><button class="btn" type="submit">Start transcode</button><button class="btn ghost" type="button" data-act="reset-job">Choose another file</button></div>
        </form>`;
    }
    const claim = job.scanResult && !job.scanResult.clean;
    return `<div class="studio-head"><p class="eyebrow">Transcoding</p><h1>${escapeHtml(job.title || job.fileName)}</h1><p class="lede">${job.stage === "queue" ? "Renditions are building from the master. Publishing waits until the copyright scan finishes." : job.stage === "published" ? "This video is on the home grid and the Lagos origin." : "The ladder is packaged. Decide the claim, then publish."}</p></div>
      <div class="stats">
        <div class="stat"><b>${job.stage === "published" ? "Live" : job.stage === "review" ? "Ready" : "Running"}</b><span>Pipeline</span></div>
        <div class="stat"><b>8</b><span>Video renditions</span></div>
        <div class="stat"><b>AAC + Opus</b><span>Audio</span></div>
        <div class="stat"><b>${claim ? job.scanResult.score + "%" : job.steps.scan >= 100 ? "Clear" : "—"}</b><span>Audio match</span></div>
      </div>
      <div class="split">
        <div class="panel">${pipelineRows(job)}</div>
        <div class="panel">
          <h2>Copyright scan</h2>
          ${
            job.steps.scan < 100
              ? `<p class="hint">Fingerprints are compared when the renditions and captions are done.</p>`
              : claim
                ? `<p><strong>${escapeHtml(job.scanResult.asset)}</strong> · ${escapeHtml(job.scanResult.owner)} · ${job.scanResult.score}% · ${escapeHtml(job.scanResult.span)}</p>${finger("up", true)}${claimActions(job.claimId)}`
                : `<p>No registered audio matched this file.</p>`
          }
          <div class="btn-row"><button class="btn" type="button" data-act="publish" ${job.stage === "review" && (!claim || job.decision) ? "" : "disabled"}>${job.stage === "published" ? "Published" : "Publish"}</button></div>
        </div>
      </div>`;
  }

  function finger(seed, matched) {
    let h = seed === "up" ? 19 : 7;
    let html = `<div class="fp" aria-hidden="true">`;
    for (let i = 0; i < 48; i += 1) {
      h = (h * 17 + 31) % 97;
      const on = matched && i > 14 && i < 34;
      const shared = on ? (i * 13) % 80 : h % 86;
      html += `<i class="${on ? "on" : ""}" style="height:${18 + shared}%"></i>`;
    }
    return html + "</div>";
  }

  function claimActions(id) {
    return `<div class="actions">
      <button class="btn ghost" type="button" data-act="decide" data-decision="share">Share revenue</button>
      <button class="btn ghost" type="button" data-act="decide" data-decision="mute">Mute matched audio</button>
      <button class="btn ghost" type="button" data-act="decide" data-decision="dispute">Dispute</button>
      <button class="btn ghost" type="button" data-act="decide" data-decision="release">Release</button>
    </div>`;
  }

  function liveView() {
    const cast = state.broadcast;
    const elapsed = cast.on ? Math.round((Date.now() - cast.startedAt) / 1000) : 0;
    return `<div class="studio-head"><p class="eyebrow">Live</p><h1>Live desk</h1><p class="lede">Ingest health, chat, and the delay a viewer actually feels. Tari's channel goes out through the same edges as the rest of Kinora.</p></div>
      <div class="stats">
        <div class="stat"><b data-live-viewers>${compact(cast.viewers)}</b><span>Watching</span></div>
        <div class="stat"><b data-live-peak>${compact(cast.peak)}</b><span>Peak</span></div>
        <div class="stat"><b data-live-kbps>${cast.on ? cast.bitrate.toFixed(1) : "0.0"} Mbps</b><span>Ingest</span></div>
        <div class="stat"><b data-live-delay>${cast.on ? cast.latency.toFixed(1) + " s" : "—"}</b><span>Glass to glass</span></div>
      </div>
      <div class="live-layout" style="margin-top:16px">
        <div class="panel">
          <div class="preview-live">${artwork({ id: "desk-preview", art: "desk" })}${cast.on ? `<span class="live-flag">LIVE</span>` : ""}</div>
          <label class="field"><span>Title</span><input id="live-title" value="${escapeHtml(cast.title)}" ${cast.on ? "readonly" : ""} /></label>
          <p class="health ${cast.health}" style="margin-top:12px"><i></i> <span data-live-health>${cast.health === "bad" ? "Ingest is short — viewers will see a stall" : cast.on ? "Ingest is healthy" : "Desk is idle"}</span></p>
          <p class="hint">Dropped frames <span data-live-drop>${cast.dropped}</span> · On air ${formatTime(elapsed)} · Keyframe every 2 s</p>
          <div class="btn-row">
            ${cast.on ? `<button class="btn warn" type="button" data-act="end-live">End stream</button>` : `<button class="btn" type="button" data-act="start-live">Start stream</button>`}
            <button class="btn ghost" type="button" data-act="trip" ${cast.on ? "" : "disabled"}>${cast.health === "bad" ? "Restore ingest" : "Trip the ingest"}</button>
            ${cast.videoId ? `<button class="btn line" type="button" data-act="watch" data-id="${cast.videoId}">Open as a viewer</button>` : ""}
          </div>
        </div>
        <div class="panel">
          <h2>Chat</h2>
          <div class="chat-log" id="chat-log">${cast.chat.map((line) => `<p class="chat-line"><b>${escapeHtml(line.name)}</b>${escapeHtml(line.text)}</p>`).join("")}</div>
          <form class="chat-form" data-form="desk" style="margin-top:10px"><input name="text" placeholder="Message the room" aria-label="Desk chat" maxlength="140" /><button class="btn" type="submit" ${cast.on ? "" : "disabled"}>Send</button></form>
        </div>
      </div>`;
  }

  function rankView() {
    const w = state.weights;
    const rows = state.videos
      .filter((item) => item.kind !== "short")
      .map((item) => ({ item, parts: scoreVideo(item) }))
      .sort((a, b) => b.parts.total - a.parts.total)
      .slice(0, 8);
    const max = rows[0] ? rows[0].parts.total : 1;
    const sliders = [
      ["history", "Watch history"],
      ["subs", "Subscriptions"],
      ["topic", "Topic"],
      ["fresh", "Freshness"],
      ["diverse", "Other channels"],
    ];
    return `<div class="studio-head"><p class="eyebrow">Recommendations</p><h1>How home gets its order</h1><p class="lede">A mix of subscriptions, what Tari just watched, topic, freshness, and a push toward channels that were not just on screen. The preview updates as the mix changes.</p></div>
      <div class="split">
        <div class="panel">
          <h2>Signals</h2>
          ${sliders
            .map(
              ([key, label]) => `<label class="slider-row"><span>${label}</span><input type="range" min="0" max="100" value="${w[key]}" data-weight="${key}" aria-label="${label}" /><b data-weight-out="${key}">${w[key]}</b></label>`
            )
            .join("")}
          <div class="btn-row">
            <button class="btn" type="button" data-act="apply-rank">${state.ranked ? "Ranking is on home" : "Use this ranking on home"}</button>
            <button class="btn ghost" type="button" data-act="reset-rank">Reset mix</button>
          </div>
        </div>
        <div class="panel">
          <h2>Preview</h2>
          <div id="rank-preview">${rows
            .map((row, index) => {
              const width = Math.max(6, Math.round((row.parts.total / max) * 100));
              return `<div class="rank-row"><span>${index + 1}</span><span><strong>${escapeHtml(row.item.title)}</strong><p class="why">${escapeHtml(explain(row.item, row.parts))}</p><span class="track"><span style="width:${width}%"></span></span></span><b>${row.parts.total.toFixed(2)}</b></div>`;
            })
            .join("")}</div>
        </div>
      </div>`;
  }

  function rightsView() {
    return `<div class="studio-head"><p class="eyebrow">Copyright</p><h1>Matches against registered audio</h1><p class="lede">A fingerprint either shares revenue, mutes the matched span, or goes to review. Releasing a claim puts the video back with the uploader.</p></div>
      ${state.claims
        .map((claim) => {
          const item = videoById(claim.videoId);
          const statusClass = claim.status === "Active" ? "active" : claim.status === "Released" ? "released" : claim.status === "Muted" ? "muted" : claim.status === "In review" ? "review" : "shared";
          return `<article class="claim">
            <header><div><h3>${escapeHtml(item ? item.title : claim.videoId)}</h3><p class="meta">${escapeHtml(claim.owner)} · ${escapeHtml(claim.asset)} · ${claim.score}% · ${escapeHtml(claim.span)}</p></div><span class="status ${statusClass}">${escapeHtml(claim.status)}</span></header>
            <div class="fp-label"><span>Fingerprint</span><span>Orange is the matched span</span></div>
            ${finger(claim.id, claim.status !== "Released")}
            <p class="hint">Policy: ${escapeHtml(claim.policy)}</p>
            ${claim.status === "Active" || claim.status === "Muted" ? claimActions(claim.id).replaceAll('data-act="decide"', `data-act="claim" data-id="${claim.id}"`) : ""}
            ${state.disputeId === claim.id ? `<form class="fields" data-form="dispute" data-id="${claim.id}" style="margin-top:12px"><label class="field"><span>Why this match is wrong</span><textarea name="reason">${escapeHtml(state.disputeDraft)}</textarea></label><button class="btn" type="submit">Send to review</button></form>` : ""}
          </article>`;
        })
        .join("")}`;
  }

  function deliveryView() {
    const selected = regionById(state.region);
    const titles = state.videos.filter((item) => item.kind !== "short").slice(0, 6);
    return `<div class="studio-head"><p class="eyebrow">Delivery</p><h1>Edges, then the shield, then Lagos</h1><p class="lede">A viewer is served from the nearest healthy edge. A miss falls back to the Frankfurt shield, then the Lagos origin. The watch page shows the edge you pick here.</p></div>
      <div class="stats">
        <div class="stat"><b>${selected.hit.toFixed(1)}%</b><span>${selected.city} cache hit</span></div>
        <div class="stat"><b>${selected.p95} ms</b><span>p95 from this edge</span></div>
        <div class="stat"><b>${selected.egress}</b><span>Egress this week</span></div>
        <div class="stat"><b>${state.warming === selected.id ? "Warming" : "Healthy"}</b><span>Status</span></div>
      </div>
      <div class="split">
        <div class="map" aria-hidden="true">${REGIONS.map((item) => `<button class="dot${item.id === state.region ? " on" : ""}${state.warming === item.id ? " warming" : ""}" style="left:${item.x}%;top:${item.y}%" type="button" data-act="region" data-id="${item.id}"><span>${escapeHtml(item.city)}</span></button>`).join("")}</div>
        <div class="panel">
          <h2>Edges</h2>
          ${REGIONS.map(
            (item) => `<button class="region${item.id === state.region ? " on" : ""}" type="button" data-act="region" data-id="${item.id}"><span><strong>${escapeHtml(item.city)}</strong><br><small>${escapeHtml(item.area)}</small></span><small data-lat="${item.id}">${item.p95} ms</small><small>${item.hit.toFixed(1)}%</small></button>`
          ).join("")}
        </div>
      </div>
      <div class="panel" style="margin-top:16px">
        <h2>Cache for a title</h2>
        <label class="field"><span>Video</span><select id="cache-title">${titles.map((item) => `<option value="${item.id}" ${state.cacheTitle === item.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select></label>
        <p class="hint">Origin in Lagos. Shield in Frankfurt. ${escapeHtml(selected.city)} ${state.warming === selected.id ? "is refilling after a purge." : "is serving hits from the edge."}</p>
        <div class="btn-row"><button class="btn" type="button" data-act="purge">Purge ${escapeHtml(selected.city)}</button></div>
      </div>`;
  }

  function guide() {
    let last = "";
    const wide = state.expanded || window.innerWidth <= 800;
    return GUIDE.map((item) => {
      const show = item.group !== last;
      last = item.group;
      const on = state.view === item.id;
      const rule = show && item.group === "Studio" ? `<div class="g-rule"></div>` : "";
      const label = show && wide ? `<p class="g-label">${escapeHtml(item.group)}</p>` : "";
      const name = wide ? item.label : item.short || item.label;
      return `${rule}${label}<button class="g-item${on ? " on" : ""}" type="button" data-act="go" data-view="${item.id}"${on ? ' aria-current="page"' : ""}>${icon(item.icon)}<span>${escapeHtml(name)}</span></button>`;
    }).join("");
  }

  function top() {
    const unread = state.notes.filter((note) => note.unread).length;
    return `<div class="brand-cluster">
        <button class="menu-btn" type="button" data-act="toggle-guide" aria-expanded="${state.expanded}" aria-label="${state.expanded ? "Collapse menu" : "Expand menu"}">${icon("menu")}</button>
        <a class="brand" href="#home" data-act="go" data-view="home">${mark()}<strong class="brand-name">Kinora</strong></a>
      </div>
      <div class="search-wrap">
        <form class="search" data-form="search" role="search">
          <label class="sr-only" for="search">Search</label>
          <input id="search" name="q" type="search" placeholder="Search" value="${escapeHtml(state.query)}" autocomplete="off" />
          <button type="submit" aria-label="Search">${icon("search")}</button>
        </form>
        <button class="mic" type="button" data-act="mic" aria-label="Voice search">${icon("mic")}</button>
      </div>
      <div class="actions">
        <button class="icon-btn" type="button" data-act="go" data-view="upload" aria-label="Upload">${icon("upload")}</button>
        <div style="position:relative">
          <button class="icon-btn" type="button" data-act="bell" aria-expanded="${state.bellOpen}" aria-label="Notifications">${icon("bell")}${unread ? `<span class="badge">${unread}</span>` : ""}</button>
          ${
            state.bellOpen
              ? `<div class="popover"><h2>Notifications</h2>${state.notes
                  .map(
                    (note) => `<button class="note${note.unread ? " unread" : ""}" type="button" data-act="note" data-id="${note.id}"><strong>${escapeHtml(note.title)}</strong><small>${escapeHtml(note.body)}</small></button>`
                  )
                  .join("")}</div>`
              : ""
          }
        </div>
        <button class="avatar" type="button" data-act="go" data-view="live" aria-label="Tari Okoye, open live desk">T</button>
      </div>`;
  }

  const TITLES = {
    home: "Home",
    shorts: "Shorts",
    subs: "Subscriptions",
    library: "Library",
    history: "History",
    upload: "Upload",
    live: "Live desk",
    rank: "Ranking",
    rights: "Copyright",
    delivery: "Delivery",
    watch: "Watch",
  };

  function render() {
    const search = document.activeElement;
    const searching = search && search.id === "search";
    const caret = searching ? [search.selectionStart, search.selectionEnd] : null;
    document.querySelector("#app").classList.toggle("is-expanded", state.expanded);
    document.querySelector("#top").innerHTML = top();
    document.querySelector("#guide").innerHTML = guide();
    const views = {
      home: () => homeMain(longVideos()),
      subs: subsView,
      library: libraryView,
      history: historyView,
      upload: uploadView,
      live: liveView,
      rank: rankView,
      rights: rightsView,
      delivery: deliveryView,
      watch: watchView,
      shorts: shortsView,
    };
    document.querySelector("#content").innerHTML = (views[state.view] || views.home)();
    const item = state.view === "watch" ? videoById(state.videoId) : null;
    document.title = item ? item.title + " — Kinora" : "Kinora — " + (TITLES[state.view] || "Home");
    if (searching) {
      const field = document.querySelector("#search");
      if (field) {
        field.focus();
        if (caret) field.setSelectionRange(caret[0], caret[1]);
      }
    }
    const log = document.querySelector("#chat-log") || document.querySelector("#room-log");
    if (log) log.scrollTop = log.scrollHeight;
  }

  function remember(id) {
    state.history = [{ id, at: Date.now() }, ...state.history.filter((row) => row.id !== id)].slice(0, 30);
  }

  function go(view, id) {
    state.view = view;
    state.bellOpen = false;
    state.qualityOpen = false;
    if (view !== "watch") state.playing = false;
    if (view === "watch" && id) {
      state.videoId = id;
      state.playing = false;
      remember(id);
      if (state.progressById[id] == null) state.progressById[id] = 0;
    }
    if (view === "shorts" && id) state.shortId = id;
    if (window.innerWidth <= 800) state.expanded = false;
    const hash = id && (view === "watch" || view === "shorts") ? `#${view}/${id}` : `#${view}`;
    if (location.hash !== hash) history.pushState({ view, id }, "", hash);
    render();
  }

  function readHash() {
    const [view, id] = location.hash.replace("#", "").split("/");
    const known = GUIDE.map((item) => item.id).concat("watch");
    if (known.includes(view)) state.view = view;
    if (view === "watch" && id && videoById(id)) state.videoId = id;
    if (view === "shorts" && id && videoById(id)) state.shortId = id;
  }

  function startJob(partial) {
    state.job = Object.assign(
      {
        stage: "details",
        title: "",
        description: "",
        visibility: "public",
        category: "Music",
        sample: "clean",
        fileName: "upload.mov",
        sizeLabel: "—",
        durationLabel: "—",
        steps: blankSteps(),
        scanResult: null,
        decision: null,
        claimId: null,
      },
      partial
    );
    state.view = "upload";
    if (location.hash !== "#upload") history.pushState({ view: "upload" }, "", "#upload");
    render();
  }

  function advanceJob() {
    const job = state.job;
    if (!job || job.stage !== "queue") return;
    const step = 40;
    const bump = (key) => {
      job.steps[key] = Math.min(100, job.steps[key] + step);
    };
    if (job.steps.ingest < 100) bump("ingest");
    else if (job.steps.inspect < 100) bump("inspect");
    else {
      const pending = LADDER.find((item) => job.steps.renditions[item.id] < 100);
      if (pending) job.steps.renditions[pending.id] = Math.min(100, job.steps.renditions[pending.id] + step);
      else if (job.steps.package < 100) bump("package");
      else if (job.steps.thumbs < 100) bump("thumbs");
      else if (job.steps.captions < 100) bump("captions");
      else if (job.steps.scan < 100) bump("scan");
      else {
        job.stage = "review";
        if (job.sample === "claim") {
          job.scanResult = { clean: false, asset: "Blue Hour", owner: "Glasshouse", score: 94, span: "0:18–2:04" };
          job.claimId = "job-claim";
          const claim = {
            id: "job-claim",
            videoId: "pending-upload",
            asset: "Blue Hour",
            owner: "Glasshouse",
            score: 94,
            span: "0:18–2:04",
            status: "Active",
            policy: "Needs a decision",
          };
          state.claims = [claim, ...state.claims.filter((item) => item.id !== "job-claim")];
        } else {
          job.scanResult = { clean: true };
        }
        toast(job.sample === "claim" ? "Scan matched Glasshouse — Blue Hour." : "Transcode finished. No audio match.");
        render();
        return;
      }
    }
    if (state.view === "upload") {
      const host = document.querySelector("#pipeline");
      if (host) {
        const wrap = host.parentElement;
        const fresh = document.createElement("div");
        fresh.innerHTML = pipelineRows(job);
        wrap.replaceChild(fresh.firstElementChild, host);
        const pre = wrap.querySelector(".manifest");
        const existing = wrap.querySelectorAll(".manifest");
        if (job.steps.package >= 100 && existing.length === 0) wrap.insertAdjacentHTML("beforeend", fresh.querySelector(".manifest") ? "" : "");
        if (job.steps.package >= 100 && !wrap.querySelector(".manifest")) {
          wrap.insertAdjacentHTML(
            "beforeend",
            `<pre class="manifest">#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=5800000,RESOLUTION=1920x1080
1080p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720
720p/index.m3u8</pre>`
          );
        }
      } else render();
    }
  }

  function publish() {
    const job = state.job;
    if (!job || job.stage !== "review") return;
    const claim = job.scanResult && !job.scanResult.clean;
    if (claim && !job.decision) {
      toast("Choose what to do with the match first.");
      return;
    }
    const id = "upload-" + Date.now();
    const policy = { share: "Share revenue", mute: "Muted span", dispute: "In review", release: "Released" }[job.decision] || "Clear";
    state.videos.unshift(
      video({
        id,
        order: -Date.now(),
        title: job.title,
        channelId: "tari",
        views: 0,
        age: "Just now",
        ageDays: 0,
        duration: job.sample === "claim" ? 252 : 2536,
        category: job.category,
        topics: [job.category.toLowerCase()],
        art: job.sample === "claim" ? "rain" : "night",
        likes: 0,
        description: job.description || "Uploaded from Tari's desk.",
        caption: "Published from the Kinora desk.",
        visibility: job.visibility,
      })
    );
    if (claim) {
      const row = state.claims.find((item) => item.id === "job-claim");
      if (row) {
        row.videoId = id;
        row.policy = policy;
        row.status = job.decision === "release" ? "Released" : job.decision === "mute" ? "Muted" : job.decision === "dispute" ? "In review" : "Active";
      }
    }
    job.stage = "published";
    if (job.visibility !== "public") state.saved[id] = true;
    CHANNELS.find((item) => item.id === "tari").subs = "19";
    toast(job.visibility === "public" ? "Published to home and the Lagos origin." : "Saved as " + job.visibility + ".");
    state.chip = "All";
    state.query = "";
    if (job.visibility === "private") go("library");
    else go("watch", id);
  }

  function applyDecision(decision, claimId) {
    const labels = { share: "Revenue will be shared.", mute: "Matched audio will be muted.", dispute: "Add a reason for review.", release: "Claim released." };
    if (claimId === "job-claim" || (!claimId && state.job)) {
      state.job.decision = decision;
      const row = state.claims.find((item) => item.id === "job-claim");
      if (row && decision !== "dispute") {
        row.policy = { share: "Share revenue", mute: "Muted span", release: "Released" }[decision];
        row.status = decision === "release" ? "Released" : decision === "mute" ? "Muted" : "Shared";
      }
      if (decision === "dispute") {
        state.disputeId = "job-claim";
        state.view = "rights";
      }
      toast(labels[decision]);
      render();
      return;
    }
    const row = state.claims.find((item) => item.id === claimId);
    if (!row) return;
    if (decision === "dispute") {
      state.disputeId = claimId;
      render();
      return;
    }
    row.status = decision === "release" ? "Released" : decision === "mute" ? "Muted" : "Shared";
    row.policy = { share: "Share revenue", mute: "Muted span", release: "Released" }[decision];
    toast(labels[decision]);
    render();
  }

  function onClick(event) {
    const actEl = event.target.closest("[data-act]");
    if (!actEl) {
      if (state.bellOpen && !event.target.closest(".popover")) {
        state.bellOpen = false;
        render();
      }
      if (state.qualityOpen && !event.target.closest(".qmenu") && !event.target.closest("[data-act='quality-toggle']")) {
        state.qualityOpen = false;
        render();
      }
      return;
    }
    const act = actEl.dataset.act;
    if (actEl.tagName === "A") event.preventDefault();
    if (act === "toggle-guide") {
      state.expanded = !state.expanded;
      render();
      return;
    }
    if (act === "close-guide") {
      state.expanded = false;
      render();
      return;
    }
    if (act === "go") {
      go(actEl.dataset.view);
      return;
    }
    if (act === "watch") {
      go("watch", actEl.dataset.id);
      return;
    }
    if (act === "short") {
      go("shorts", actEl.dataset.id);
      return;
    }
    if (act === "chip") {
      state.chip = actEl.dataset.chip;
      state.query = "";
      state.channelFilter = null;
      if (state.view !== "home") state.view = "home";
      render();
      return;
    }
    if (act === "channel") {
      state.channelFilter = actEl.dataset.id;
      state.view = "home";
      state.chip = "All";
      go("home");
      return;
    }
    if (act === "clear-channel") {
      state.channelFilter = null;
      render();
      return;
    }
    if (act === "clear-search") {
      state.query = "";
      render();
      return;
    }
    if (act === "like") {
      const item = videoById(actEl.dataset.id);
      state.liked[item.id] = !state.liked[item.id];
      render();
      return;
    }
    if (act === "save") {
      const id = actEl.dataset.id;
      state.saved[id] = !state.saved[id];
      toast(state.saved[id] ? "Saved to your library." : "Removed from your library.");
      render();
      return;
    }
    if (act === "sub") {
      const id = actEl.dataset.id;
      state.subs[id] = !state.subs[id];
      toast(state.subs[id] ? "Subscribed to " + channel(id).name + "." : "Unsubscribed from " + channel(id).name + ".");
      render();
      return;
    }
    if (act === "play") {
      const item = videoById(state.videoId);
      if (item && item.live) {
        toast("This is live. Playback stays at the edge.");
        return;
      }
      state.playing = !state.playing;
      render();
      return;
    }
    if (act === "cc") {
      state.captions = !state.captions;
      render();
      return;
    }
    if (act === "quality-toggle") {
      state.qualityOpen = !state.qualityOpen;
      render();
      return;
    }
    if (act === "quality") {
      state.quality = actEl.dataset.quality;
      state.qualityOpen = false;
      const rung = LADDER.find((item) => item.id === state.quality);
      toast("Playing " + state.quality + " · " + rung.bitrate + " from " + regionById(state.region).city + ".");
      render();
      return;
    }
    if (act === "full") {
      const player = document.querySelector("#player");
      if (document.fullscreenElement) document.exitFullscreen();
      else if (player.requestFullscreen) player.requestFullscreen();
      return;
    }
    if (act === "autoplay") {
      state.autoplay = !state.autoplay;
      render();
      return;
    }
    if (act === "bell") {
      state.bellOpen = !state.bellOpen;
      if (state.bellOpen) state.notes.forEach((note) => (note.unread = false));
      render();
      return;
    }
    if (act === "note") {
      const note = state.notes.find((item) => item.id === actEl.dataset.id);
      state.bellOpen = false;
      if (note && note.video) go("watch", note.video);
      else if (note) go(note.view);
      return;
    }
    if (act === "mic") {
      toast("Voice search isn't available here. Type a title or a channel.");
      document.querySelector("#search").focus();
      return;
    }
    if (act === "browse") {
      document.querySelector("#file-input").click();
      return;
    }
    if (act === "sample") {
      const claim = actEl.dataset.sample === "claim";
      startJob({
        sample: claim ? "claim" : "clean",
        fileName: claim ? "blue-hour-at-home.mov" : "lagos-night-market.mov",
        sizeLabel: claim ? "860 MB" : "3.8 GB",
        durationLabel: claim ? "4:12" : "42:16",
        title: claim ? "Blue hour, played at the kitchen table" : "Lagos night market, uncut",
        description: claim
          ? "A home recording. The piano quotes Glasshouse."
          : "An uncut walk through the night market, ProRes master.",
        category: "Music",
      });
      return;
    }
    if (act === "reset-job") {
      state.job = null;
      render();
      return;
    }
    if (act === "decide") {
      applyDecision(actEl.dataset.decision, state.job && state.job.claimId);
      return;
    }
    if (act === "claim") {
      applyDecision(actEl.dataset.decision, actEl.dataset.id);
      return;
    }
    if (act === "publish") {
      publish();
      return;
    }
    if (act === "apply-rank") {
      state.ranked = true;
      toast("Home is now ordered by this mix.");
      go("home");
      return;
    }
    if (act === "reset-rank") {
      state.weights = { history: 35, subs: 30, topic: 20, fresh: 10, diverse: 5 };
      state.ranked = false;
      toast("Ranking mix reset. Home is back to the editorial order.");
      render();
      return;
    }
    if (act === "region") {
      state.region = actEl.dataset.id;
      render();
      return;
    }
    if (act === "purge") {
      const region = regionById(state.region);
      const select = document.querySelector("#cache-title");
      const title = select ? videoById(select.value) : videoById("night-market");
      state.warming = region.id;
      toast("Purged " + region.city + " for " + (title ? title.title : "the title") + ".");
      render();
      setTimeout(() => {
        if (state.warming === region.id) {
          state.warming = null;
          toast(region.city + " is warm again.");
          if (state.view === "delivery" || state.view === "watch") render();
        }
      }, 2200);
      return;
    }
    if (act === "start-live") {
      const title = document.querySelector("#live-title");
      state.broadcast.title = title ? title.value.trim() || state.broadcast.title : state.broadcast.title;
      state.broadcast.on = true;
      state.broadcast.health = "ok";
      state.broadcast.viewers = 12;
      state.broadcast.peak = 12;
      state.broadcast.bitrate = 6.2;
      state.broadcast.latency = 3.2;
      state.broadcast.dropped = 0;
      state.broadcast.startedAt = Date.now();
      const id = "live-" + Date.now();
      state.broadcast.videoId = id;
      state.videos.unshift(
        video({
          id,
          order: -Date.now(),
          title: state.broadcast.title,
          channelId: "tari",
          watching: 12,
          age: "Live",
          ageDays: 0,
          duration: 0,
          category: "Stage",
          topics: ["stage"],
          art: "desk",
          live: true,
          likes: 0,
          description: "Tari is live from the Kinora desk.",
          caption: "Live from the desk.",
        })
      );
      state.rooms[id] = [];
      toast("You are live. Lagos origin is pushing to the edges.");
      render();
      return;
    }
    if (act === "end-live") {
      const cast = state.broadcast;
      cast.on = false;
      cast.health = "idle";
      const item = videoById(cast.videoId);
      if (item) {
        item.live = false;
        item.ended = true;
        item.age = "Just now";
        item.views = cast.peak;
        item.duration = Math.max(1, Math.round((Date.now() - cast.startedAt) / 1000));
        item.watching = 0;
      }
      toast("Stream ended. A recording is on your channel.");
      render();
      return;
    }
    if (act === "trip") {
      const cast = state.broadcast;
      if (cast.health === "bad") {
        cast.health = "ok";
        cast.bitrate = 6.2;
        toast("Ingest restored.");
      } else {
        cast.health = "bad";
        cast.bitrate = 1.4;
        cast.dropped += 40;
        toast("Ingest dropped. Viewers will buffer.");
      }
      render();
      return;
    }
    if (act === "clear-history") {
      state.history = [];
      toast("History cleared.");
      render();
      return;
    }
    if (act === "next-short" || act === "prev-short") {
      const shorts = state.videos.filter((item) => item.kind === "short");
      const index = shorts.findIndex((item) => item.id === state.shortId);
      const next = act === "next-short" ? Math.min(shorts.length - 1, index + 1) : Math.max(0, index - 1);
      go("shorts", shorts[next].id);
    }
  }

  function onSubmit(event) {
    const form = event.target.closest("form");
    if (!form) return;
    event.preventDefault();
    const kind = form.dataset.form;
    const data = new FormData(form);
    if (kind === "search") {
      state.query = String(data.get("q") || "");
      state.view = "home";
      render();
      return;
    }
    if (kind === "comment") {
      const text = String(data.get("text") || "").trim();
      if (!text) return;
      state.extraComments[state.videoId] = [{ name: "Tari Okoye", text, time: "Just now" }, ...(state.extraComments[state.videoId] || [])];
      state.draft = "";
      render();
      return;
    }
    if (kind === "room" || kind === "desk") {
      const text = String(data.get("text") || "").trim();
      if (!text) return;
      const line = { name: "Tari", text, mine: true };
      if (kind === "desk") state.broadcast.chat.push(line);
      else {
        state.rooms[state.videoId] = state.rooms[state.videoId] || [];
        state.rooms[state.videoId].push(line);
      }
      state.chatDraft = "";
      render();
      return;
    }
    if (kind === "details") {
      state.job.title = String(data.get("title") || "").trim();
      state.job.description = String(data.get("description") || "").trim();
      state.job.visibility = String(data.get("visibility") || "public");
      state.job.category = String(data.get("category") || "Music");
      if (!state.job.title) {
        toast("Add a title before transcoding.");
        return;
      }
      state.job.stage = "queue";
      state.job.steps = blankSteps();
      toast("Master accepted. Building the ladder.");
      render();
      return;
    }
    if (kind === "dispute") {
      const reason = String(data.get("reason") || "").trim();
      if (!reason) {
        toast("Add a short reason.");
        return;
      }
      const row = state.claims.find((item) => item.id === form.dataset.id);
      if (row) {
        row.status = "In review";
        row.policy = reason;
      }
      if (state.job && state.job.claimId === form.dataset.id) state.job.decision = "dispute";
      state.disputeId = null;
      state.disputeDraft = "";
      toast("Claim sent to review.");
      render();
    }
  }

  function onInput(event) {
    const target = event.target;
    if (target.id === "search") {
      state.query = target.value;
      if (state.query) {
        state.chip = "All";
        state.channelFilter = null;
      }
      if (state.view !== "home") state.view = "home";
      render();
      return;
    }
    if (target.dataset.weight) {
      state.weights[target.dataset.weight] = Number(target.value);
      const out = document.querySelector(`[data-weight-out="${target.dataset.weight}"]`);
      if (out) out.textContent = target.value;
      const preview = document.querySelector("#rank-preview");
      if (preview) {
        const rows = state.videos
          .filter((item) => item.kind !== "short")
          .map((item) => ({ item, parts: scoreVideo(item) }))
          .sort((a, b) => b.parts.total - a.parts.total)
          .slice(0, 8);
        const max = rows[0] ? rows[0].parts.total : 1;
        preview.innerHTML = rows
          .map((row, index) => {
            const width = Math.max(6, Math.round((row.parts.total / max) * 100));
            return `<div class="rank-row"><span>${index + 1}</span><span><strong>${escapeHtml(row.item.title)}</strong><p class="why">${escapeHtml(explain(row.item, row.parts))}</p><span class="track"><span style="width:${width}%"></span></span></span><b>${row.parts.total.toFixed(2)}</b></div>`;
          })
          .join("");
      }
      return;
    }
    if (target.hasAttribute("data-scrub")) {
      const item = videoById(state.videoId);
      if (!item || item.live) return;
      state.progressById[item.id] = Number(target.value) / 1000;
      const label = document.querySelector("[data-elapsed]");
      if (label) label.textContent = formatTime(state.progressById[item.id] * item.duration);
      return;
    }
    if (target.dataset.volume != null && target.dataset.volume !== undefined && target.hasAttribute("data-volume")) {
      state.volume = Number(target.value);
    }
    if (target.id === "live-title" && !state.broadcast.on) state.broadcast.title = target.value;
    if (target.id === "cache-title") state.cacheTitle = target.value;
  }

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("submit", onSubmit);
  document.body.addEventListener("input", onInput);

  document.querySelector("#file-input").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (file.type && !file.type.startsWith("video/")) {
      toast("Choose a video file.");
      return;
    }
    startJob({
      sample: "clean",
      fileName: file.name,
      sizeLabel: formatBytes(file.size),
      durationLabel: "Length read at inspect",
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      description: "",
    });
  });

  document.addEventListener("dragover", (event) => {
    if (event.target.closest("#drop")) event.preventDefault();
  });
  document.addEventListener("drop", (event) => {
    const zone = event.target.closest("#drop");
    if (!zone) return;
    event.preventDefault();
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (!file) return;
    startJob({
      sample: "clean",
      fileName: file.name,
      sizeLabel: formatBytes(file.size),
      durationLabel: "Length read at inspect",
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    });
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement && document.activeElement.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    if (event.key === "Escape") {
      state.expanded = false;
      state.bellOpen = false;
      state.qualityOpen = false;
      state.disputeId = null;
      render();
      return;
    }
    if (typing) return;
    if (event.key === "/") {
      event.preventDefault();
      const field = document.querySelector("#search");
      if (field) field.focus();
    }
    if (event.key === " " && state.view === "watch") {
      event.preventDefault();
      state.playing = !state.playing;
      render();
    }
    if ((event.key === "f" || event.key === "F") && state.view === "watch") {
      const player = document.querySelector("#player");
      if (player && player.requestFullscreen) player.requestFullscreen();
    }
  });

  window.addEventListener("popstate", () => {
    readHash();
    render();
  });

  setInterval(() => {
    state.videos.forEach((item) => {
      if (item.live && !item.ended) {
        item.watching = Math.max(8, item.watching + Math.round(Math.random() * 30 - 12));
        const node = document.querySelector(`[data-watching="${item.id}"]`);
        if (node) node.textContent = compact(item.watching) + " watching";
      }
    });
    const cast = state.broadcast;
    if (cast.on) {
      if (cast.health === "bad") {
        cast.viewers = Math.max(1, cast.viewers - Math.round(Math.random() * 4));
        cast.dropped += Math.round(Math.random() * 3);
        cast.bitrate = 1.1 + Math.random() * 0.6;
        cast.latency = 7 + Math.random();
      } else {
        cast.viewers += Math.round(Math.random() * 5);
        cast.peak = Math.max(cast.peak, cast.viewers);
        cast.bitrate = 6 + Math.random() * 0.4;
        cast.latency = 3 + Math.random() * 0.4;
      }
      const liveVideo = videoById(cast.videoId);
      if (liveVideo && liveVideo.live) liveVideo.watching = cast.viewers;
      const viewers = document.querySelector("[data-live-viewers]");
      const peak = document.querySelector("[data-live-peak]");
      const kbps = document.querySelector("[data-live-kbps]");
      const delay = document.querySelector("[data-live-delay]");
      const drop = document.querySelector("[data-live-drop]");
      if (viewers) viewers.textContent = compact(cast.viewers);
      if (peak) peak.textContent = compact(cast.peak);
      if (kbps) kbps.textContent = cast.bitrate.toFixed(1) + " Mbps";
      if (delay) delay.textContent = cast.latency.toFixed(1) + " s";
      if (drop) drop.textContent = String(cast.dropped);
    }
    if (state.playing && state.view === "watch") {
      const item = videoById(state.videoId);
      if (item && !item.live) {
        const nextTime = (state.progressById[item.id] || 0) * item.duration + 0.25;
        state.progressById[item.id] = Math.min(1, nextTime / item.duration);
        const label = document.querySelector("[data-elapsed]");
        const scrub = document.querySelector("[data-scrub]");
        if (label) label.textContent = formatTime(state.progressById[item.id] * item.duration);
        if (scrub && document.activeElement !== scrub) scrub.value = String(Math.round(state.progressById[item.id] * 1000));
        if (state.progressById[item.id] >= 1) {
          state.playing = false;
          const upcoming = recommendations(item.id)[0];
          if (state.autoplay && upcoming) {
            toast("Up next: " + upcoming.title);
            go("watch", upcoming.id);
          } else render();
        }
      }
    }
    advanceJob();
    chatBag += 1;
    if (chatBag % 8 === 0) {
      const line = { name: NAMES[chatBag % NAMES.length], text: CHAT_LINES[chatBag % CHAT_LINES.length] };
      if (state.broadcast.on) state.broadcast.chat.push(line);
      ["late-radio", "dusk-set", state.broadcast.videoId].filter(Boolean).forEach((id) => {
        state.rooms[id] = state.rooms[id] || [];
        state.rooms[id].push(line);
        if (state.rooms[id].length > 40) state.rooms[id].shift();
      });
      const log = document.querySelector("#chat-log");
      const room = document.querySelector("#room-log");
      const html = `<p class="chat-line"><b>${escapeHtml(line.name)}</b>${escapeHtml(line.text)}</p>`;
      if (log && state.view === "live" && state.broadcast.on) {
        log.insertAdjacentHTML("beforeend", html);
        log.scrollTop = log.scrollHeight;
      }
      if (room && state.view === "watch") {
        const current = videoById(state.videoId);
        if (current && current.live) {
          room.insertAdjacentHTML("beforeend", html);
          room.scrollTop = room.scrollHeight;
        }
      }
    }
    REGIONS.forEach((item) => {
      if (state.warming === item.id) return;
      const node = document.querySelector(`[data-lat="${item.id}"]`);
      if (node) node.textContent = Math.max(8, item.p95 + Math.round(Math.random() * 4 - 2)) + " ms";
    });
  }, 250);

  readHash();
  render();
})();
