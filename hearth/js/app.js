(() => {
  const FIRST = ["Amaka", "Seyi", "Lara", "Jonah", "Priya", "Mateo", "Hana", "Kwame", "Elena", "Omar", "Zainab", "Felix", "Ruth", "Kenji", "Ayo", "Noor", "Chioma", "Leah", "Samir", "Grace", "Idris", "Bea", "Yusuf", "Tari", "Nia", "Hugo", "Sade", "Ibrahim", "Mei", "Pavel", "Chuka", "Bola", "Remi", "Tess", "Malik", "Ines", "Wale", "Jonah"];
  const LAST = ["Diallo", "Okafor", "Mensah", "Santos", "Rahman", "Silva", "Kim", "Boateng", "Vargas", "Hassan", "Bello", "Okeke", "Nwankwo", "Cohen", "Ibrahim", "Park", "Lawal", "Costa", "Adebayo", "Nakamura"];
  const TILES = ["#d7e6ff", "#6f93f6", "#f6a9c6", "#f4e2b8", "#c8f0dc", "#f0c7a0"];
  const AMBIENT = [
    "I can take a look after this call.",
    "The preview looks steady on my side.",
    "Leaving a note before I sign off.",
    "That last point is the one to keep.",
    "Count me in for the evening session.",
    "Pushing a small fix for the empty state.",
    "Voice is clear from here.",
    "I'll follow up in the thread.",
    "The new join flow feels quicker.",
    "Noted — I'll reply properly after standup.",
  ];
  const MENTIONS = [
    "@ada the queue has a new report.",
    "@ada can you glance at #general?",
    "@here story hour is live.",
    "@ada someone raised a hand in the room.",
  ];

  let seq = 1;
  let toastTimer = 0;
  let typingTimer = 0;

  const state = {
    mode: "client",
    communityId: "northwind",
    channelId: "fireside",
    panel: null,
    navOpen: false,
    settingsOpen: false,
    draft: "",
    reply: null,
    peopleQuery: "",
    typing: "",
    feed: [],
    inbox: [],
    me: {
      id: "me",
      name: "Adaeze Okonkwo",
      handle: "ada",
      status: "online",
    },
    voice: {
      communityId: "northwind",
      channelId: "fireside",
      muted: false,
      deafened: false,
      video: false,
      hand: false,
    },
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function hash(value) {
    let h = 0;
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h;
  }

  function uid(prefix) {
    seq += 1;
    return prefix + seq;
  }

  function clock(ts) {
    return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  function rel(ts) {
    const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
    if (mins < 60) return mins + "m";
    const hours = Math.round(mins / 60);
    return hours + "h";
  }

  function dayLabel() {
    return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function avatar(id, size) {
    const h = hash(id);
    const pick = (list, salt) => list[(h + salt) % list.length];
    const skin = pick(["#f6d3b8", "#e8b48a", "#c68642", "#8d5524", "#f1c7a0", "#a56b3c"], 1);
    const hair = pick(["#1b1b1d", "#3a2a1a", "#6b3a2a", "#111827", "#7c2d12", "#243044"], 2);
    const bg = pick(["#f2c14e", "#5b8def", "#e85d75", "#3dbe8b", "#f08a4b", "#9b7ede", "#4c9a8a", "#d96c4a"], 3);
    const shirt = pick(["#243044", "#3d2a4a", "#1f3d36", "#4a2c2c", "#2c3a4a"], 4);
    const glasses = h % 5 === 0;
    const smile = h % 2 === 0;
    const specs = glasses
      ? `<circle cx="33" cy="40" r="5.2" fill="none" stroke="#1b1b1d" stroke-width="1.5"/><circle cx="47" cy="40" r="5.2" fill="none" stroke="#1b1b1d" stroke-width="1.5"/><path d="M38.2 40h3.6" stroke="#1b1b1d" stroke-width="1.5"/>`
      : "";
    const mouth = smile
      ? `<path d="M34 46c2.2 2.6 9.4 2.6 12 0" stroke="#7a3b2e" fill="none" stroke-width="1.7" stroke-linecap="round"/>`
      : `<path d="M35 46.5h10" stroke="#7a3b2e" fill="none" stroke-width="1.7" stroke-linecap="round"/>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill="${bg}"/>
      <ellipse cx="40" cy="86" rx="26" ry="22" fill="${shirt}"/>
      <path d="M20 44c1-18 8-28 20-28s19 10 20 28c-4-8-10-12-20-12s-16 4-20 12z" fill="${hair}"/>
      <circle cx="40" cy="42" r="16" fill="${skin}"/>
      <path d="M25 40c2-12 8-18 15-18 8 0 14 6 16 16-5-7-10-9-16-9s-11 3-15 11z" fill="${hair}"/>
      <circle cx="34" cy="42" r="1.8" fill="#1b1b1d"/>
      <circle cx="46" cy="42" r="1.8" fill="#1b1b1d"/>
      ${mouth}
      ${specs}
    </svg>`;
  }

  function icon(name) {
    const paths = {
      mic: '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
      micOff: '<path d="M9 9v3a3 3 0 0 0 5 2"/><path d="M15 10.5V6a3 3 0 0 0-5.3-1.9"/><path d="M5 11a7 7 0 0 0 11 4M12 18v3M4 4l16 16"/>',
      headphones: '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v5a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2zM20 13v5a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2z"/>',
      headphonesOff: '<path d="M4 13a8 8 0 0 1 12.5-6.6M20 13v5a2 2 0 0 1-2 2h-1v-7h1M4 4l16 16"/><path d="M4 13v5a2 2 0 0 0 2 2h1v-7"/>',
      video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
      hand: '<path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 10V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 10.5V7.5a1.5 1.5 0 0 1 3 0V14a5 5 0 0 1-5 5h-1.5A5.5 5.5 0 0 1 5 13.5V10a1.5 1.5 0 0 1 3 0"/>',
      people: '<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.2"/><path d="M3.5 18a5.5 5.5 0 0 1 11 0M14 18a4 4 0 0 1 6.5-2.4"/>',
      bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
      shield: '<path d="M12 3l7 3v6c0 4.2-2.8 7.2-7 9-4.2-1.8-7-4.8-7-9V6l7-3z"/>',
      send: '<path d="M4 12l16-8-6 16-2-6z"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"/>',
      reply: '<path d="M9 8L4 12l5 4"/><path d="M4 12h8a6 6 0 0 1 6 6"/>',
      flag: '<path d="M5 21V4"/><path d="M5 5h10l-1.5 3L15 11H5"/>',
      trash: '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M7 7l1 13h8l1-13"/>',
      wave: '<path d="M3 14c2-6 4-6 6 0s4 6 6 0 4-6 6 0"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M6 6l12 12M18 6L6 18"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
  }

  function person(id, name, status, role, extra) {
    const more = extra || {};
    return {
      id,
      name,
      handle: more.handle || name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, ""),
      status: status || "online",
      role: role || "member",
      activity: more.activity || "",
      speaking: !!more.speaking,
      timeoutUntil: 0,
      micMuted: !!more.micMuted,
      video: !!more.video,
    };
  }

  function statusFor(index) {
    if (index % 11 === 0) return "dnd";
    if (index % 7 === 0) return "idle";
    if (index % 13 === 0) return "offline";
    return "online";
  }

  function crowd(prefix, count, offset) {
    const people = [];
    for (let i = 0; i < count; i += 1) {
      const first = FIRST[(i + offset) % FIRST.length];
      const last = LAST[(i * 2 + offset) % LAST.length];
      people.push(
        person(`${prefix}-${i}`, `${first} ${last}`, statusFor(i + offset), "member", {
          handle: `${first.toLowerCase()}${i}`,
          micMuted: i % 7 === 2,
          activity: i % 5 === 0 ? "Around the community" : "",
        })
      );
    }
    return people;
  }

  function channel(id, kind, name, topic, section) {
    return {
      id,
      kind,
      name,
      topic,
      section,
      unread: 0,
      newMarker: null,
      messages: [],
      speakerIds: [],
      audienceIds: [],
      extraListeners: 0,
      flexListeners: false,
      flexMin: 0,
      flexMax: 0,
    };
  }

  function addMsg(ch, authorId, text, agoMin, replyTo) {
    const message = {
      id: uid("m"),
      authorId,
      text,
      at: Date.now() - agoMin * 60000,
      replyTo: replyTo || null,
    };
    ch.messages.push(message);
    return message;
  }

  function seedRate(community, perMin) {
    community.msgTimes = Array.from({ length: perMin }, () => Date.now() - Math.random() * 60000);
    community.rateSeries = Array.from({ length: 16 }, (_, i) =>
      Math.max(4, Math.round(perMin * (0.72 + Math.sin(i / 2) * 0.18)))
    );
  }

  function build() {
    const ife = person("nw-ife", "Ife Adeyemi", "online", "mod", { handle: "ife", speaking: true, video: true, activity: "Hosting story hour" });
    const chidi = person("nw-chidi", "Chidi Nwosu", "online", "member", { handle: "chidi", video: false, activity: "Listening" });
    const ngozi = person("nw-ngozi", "Ngozi Bello", "online", "member", { handle: "ngozi", speaking: true, video: true });
    const tunde = person("nw-tunde", "Tunde Bakare", "online", "member", { handle: "tunde", speaking: true });
    const kelechi = person("nw-kelechi", "Kelechi Adewale", "online", "member", { handle: "kelechi" });
    const northAudience = [kelechi, ...crowd("nw-a", 22, 2)];
    const studioPeople = crowd("nw-s", 5, 6);
    const standupPeople = crowd("nw-u", 3, 9);

    const fireside = channel("fireside", "voice", "fireside", "Story hour with the studio", "Voice");
    fireside.speakerIds = [ife.id, chidi.id, ngozi.id, tunde.id];
    fireside.audienceIds = ["me", kelechi.id, ...northAudience.slice(1).map((p) => p.id)];

    const studio = channel("studio", "voice", "studio", "Working session", "Voice");
    studio.speakerIds = studioPeople.slice(0, 1).map((p) => p.id);
    studio.audienceIds = studioPeople.slice(1).map((p) => p.id);

    const standup = channel("standup", "voice", "standup", "Daily standup", "Voice");
    standup.speakerIds = standupPeople.slice(0, 1).map((p) => p.id);
    standup.audienceIds = standupPeople.slice(1).map((p) => p.id);

    const announcements = channel("announcements", "text", "announcements", "Shipped notes from the studio", "Text");
    const general = channel("general", "text", "general", "Studio-wide conversation", "Text");
    const crit = channel("design-crit", "text", "design-crit", "Feedback on work in progress", "Text");
    const shipping = channel("shipping", "text", "shipping", "What is going out this week", "Text");

    addMsg(announcements, ife.id, "Story hour is at the top of fireside tonight. Cameras optional.", 180);
    addMsg(announcements, ife.id, "Moderation notes live in the shield. Timeouts last 10 minutes.", 90);
    addMsg(general, chidi.id, "The empty state on the join button still feels abrupt.", 70);
    addMsg(general, ngozi.id, "I padded the audience grid. It holds at four columns.", 58);
    addMsg(general, tunde.id, "Joining from the train — audio only.", 46);
    const suspicious = addMsg(general, kelechi.id, "Free followers if you open this short link before midnight.", 34);
    addMsg(general, ife.id, "Please don't drop promo links in here.", 28);
    addMsg(general, "nw-a-4", "Fireside sounds warm tonight.", 18);
    addMsg(crit, chidi.id, "The speaker cards need more air between the name and the edge.", 50);
    addMsg(crit, ngozi.id, "Agreed. I moved the pill in 8 pixels.", 42);
    addMsg(crit, ife.id, "@ada the queue has a layout note in #design-crit.", 12);
    addMsg(shipping, tunde.id, "Presence dots now follow the same clock as voice.", 80);
    addMsg(shipping, ife.id, "Notifications fan out per community, not globally delayed.", 26);

    general.unread = 4;
    crit.unread = 1;

    const northwind = {
      id: "northwind",
      name: "Northwind",
      mark: "N",
      color: "linear-gradient(145deg, #ff8a4c, #e23d4a)",
      members: 12480,
      onlineBase: 1168,
      onlineDrift: 0,
      mod: true,
      people: [ife, chidi, ngozi, tunde, ...northAudience, ...studioPeople, ...standupPeople],
      channels: [announcements, general, crit, shipping, fireside, studio, standup],
      reports: [
        {
          id: "r-nw-1",
          messageId: suspicious.id,
          channelId: "general",
          authorId: kelechi.id,
          authorName: kelechi.name,
          reporter: "Amaka Diallo",
          reason: "Suspicious link",
          excerpt: suspicious.text,
          status: "open",
          at: Date.now() - 4 * 60000,
        },
      ],
      audit: [
        { id: "a1", text: "Ife Adeyemi removed a message in #shipping", at: Date.now() - 26 * 60000 },
      ],
    };
    seedRate(northwind, 86);

    const lagosSpeakers = crowd("lb-s", 2, 1);
    const lagosAudience = crowd("lb-a", 6, 4);
    const lagosHelp = channel("help", "text", "help", "Stuck on something? Ask here", "Text");
    const lagosJobs = channel("jobs", "text", "jobs", "Roles and intros, keep it specific", "Text");
    const lagosIntro = channel("introductions", "text", "introductions", "Say hello and what you ship", "Text");
    const pairing = channel("pairing", "voice", "pairing", "Pairing room", "Voice");
    pairing.speakerIds = lagosSpeakers.map((p) => p.id);
    pairing.audienceIds = lagosAudience.map((p) => p.id);
    lagosSpeakers[0].speaking = true;
    lagosSpeakers[0].video = true;
    addMsg(lagosIntro, lagosAudience[0].id, "Backend in Abuja, mostly APIs and queues.", 200);
    addMsg(lagosHelp, lagosAudience[2].id, "Has anyone shipped presence with a million idle sockets?", 40);
    addMsg(lagosHelp, lagosSpeakers[1].id, "Fan-out per community, then a shared presence bus.", 24);
    addMsg(lagosJobs, lagosAudience[4].id, "Looking for a product engineer who has run on-call for chat.", 15);
    lagosHelp.unread = 2;

    const lagos = {
      id: "lagos",
      name: "Lagos Builders",
      mark: "LB",
      color: "linear-gradient(145deg, #1f8a70, #134e4a)",
      members: 28910,
      onlineBase: 3288,
      onlineDrift: 2,
      mod: true,
      people: [...lagosSpeakers, ...lagosAudience],
      channels: [lagosIntro, lagosJobs, lagosHelp, pairing],
      reports: [
        {
          id: "r-lb-1",
          messageId: lagosJobs.messages[0].id,
          channelId: "jobs",
          authorId: lagosAudience[4].id,
          authorName: lagosAudience[4].name,
          reporter: "Seyi Okafor",
          reason: "Off-topic promo",
          excerpt: lagosJobs.messages[0].text,
          status: "open",
          at: Date.now() - 18 * 60000,
        },
      ],
      audit: [],
    };
    seedRate(lagos, 140);

    const marketSpeakers = [
      person("nm-dj", "Sade Kolade", "online", "member", { handle: "sade", speaking: true, video: true, activity: "On the decks" }),
      person("nm-host", "Malik Okon", "online", "member", { handle: "malik", speaking: true }),
    ];
    const marketAudience = crowd("nm-a", 12, 3);
    const stageChat = channel("stage-chat", "text", "stage-chat", "Talk under the set, keep it kind", "Text");
    const setlists = channel("setlists", "text", "setlists", "What is playing", "Text");
    const mainRoom = channel("main-room", "voice", "main-room", "Tonight's set", "Voice");
    mainRoom.speakerIds = marketSpeakers.map((p) => p.id);
    mainRoom.audienceIds = marketAudience.map((p) => p.id);
    mainRoom.extraListeners = 48;
    mainRoom.flexListeners = true;
    mainRoom.flexMin = 40;
    mainRoom.flexMax = 70;
    addMsg(stageChat, marketAudience[1].id, "This transition is filthy. In a good way.", 12);
    addMsg(setlists, marketSpeakers[1].id, "Next: a slower one, then we open the room.", 8);

    const market = {
      id: "night",
      name: "Night Market",
      mark: "NM",
      color: "linear-gradient(145deg, #7c5cbf, #3a2a6a)",
      members: 9140,
      onlineBase: 860,
      onlineDrift: -4,
      mod: false,
      people: [...marketSpeakers, ...marketAudience],
      channels: [stageChat, setlists, mainRoom],
      reports: [],
      audit: [],
    };
    seedRate(market, 64);

    const readers = [
      person("fn-adaora", "Adaora Ike", "online", "mod", { handle: "adaora", speaking: true, activity: "Reading a draft" }),
      ...crowd("fn-a", 5, 8),
    ];
    const drafts = channel("drafts", "text", "drafts", "Pages in progress", "Text");
    const prompts = channel("prompts", "text", "prompts", "A line to start from", "Text");
    const reading = channel("reading-room", "voice", "reading-room", "Quiet reading room", "Voice");
    reading.speakerIds = [readers[0].id];
    reading.audienceIds = readers.slice(1).map((p) => p.id);
    addMsg(drafts, readers[1].id, "Cut the second paragraph. The scene starts late.", 30);
    addMsg(prompts, readers[0].id, "Prompt: a city that only speaks after dark.", 6);

    const field = {
      id: "field",
      name: "Field Notes",
      mark: "FN",
      color: "linear-gradient(145deg, #b8a06a, #5c4a2a)",
      members: 4220,
      onlineBase: 360,
      onlineDrift: 1,
      mod: false,
      people: readers,
      channels: [drafts, prompts, reading],
      reports: [],
      audit: [],
    };
    seedRate(field, 22);

    return [northwind, lagos, market, field];
  }

  const communities = build();

  state.inbox = [
    {
      id: "n1",
      kind: "mention",
      title: "Ife Adeyemi mentioned you in #design-crit",
      body: "@ada the queue has a layout note in #design-crit.",
      communityId: "northwind",
      channelId: "design-crit",
      at: Date.now() - 12 * 60000,
      read: false,
    },
    {
      id: "n2",
      kind: "voice",
      title: "Voice is busy in Lagos Builders",
      body: "8 people are in #pairing.",
      communityId: "lagos",
      channelId: "pairing",
      at: Date.now() - 20 * 60000,
      read: false,
    },
    {
      id: "n3",
      kind: "mod",
      title: "New report in Northwind",
      body: "Suspicious link in #general.",
      communityId: "northwind",
      channelId: "general",
      at: Date.now() - 4 * 60000,
      read: true,
    },
  ];

  state.feed = [
    { at: Date.now() - 4000, text: "Northwind · #fireside · 3 people speaking" },
    { at: Date.now() - 9000, text: "Lagos Builders · #help · new message" },
    { at: Date.now() - 14000, text: "Night Market · #main-room · listeners shifted" },
    { at: Date.now() - 22000, text: "Field Notes · #reading-room · quiet" },
  ];

  const railList = document.getElementById("rail-list");
  const channelsEl = document.getElementById("channels");
  const stageEl = document.getElementById("stage");
  const panelEl = document.getElementById("panel");
  const appEl = document.getElementById("app");
  const toastEl = document.getElementById("toast");

  function communityById(id) {
    return communities.find((item) => item.id === id);
  }

  function current() {
    return communityById(state.communityId);
  }

  function getChannel(communityId, channelId) {
    const community = communityById(communityId);
    return community ? community.channels.find((item) => item.id === channelId) : null;
  }

  function viewedChannel() {
    return getChannel(state.communityId, state.channelId);
  }

  function resolve(community, id) {
    if (id === "me") {
      return {
        ...state.me,
        role: community.mod ? "mod" : "member",
        speaking: false,
        micMuted: !!(state.voice && state.voice.muted),
        video: !!(state.voice && state.voice.video),
        timeoutUntil: 0,
        activity: "",
      };
    }
    return community.people.find((item) => item.id === id) || {
      id,
      name: "Member",
      handle: "member",
      role: "member",
      status: "offline",
      speaking: false,
      micMuted: false,
      video: false,
      timeoutUntil: 0,
      activity: "",
    };
  }

  function findPerson(id) {
    if (id === "me") return state.me;
    for (const community of communities) {
      const match = community.people.find((item) => item.id === id);
      if (match) return match;
    }
    return null;
  }

  function findMessage(community, id) {
    for (const ch of community.channels) {
      const message = ch.messages.find((item) => item.id === id);
      if (message) return { message, channel: ch };
    }
    return null;
  }

  function voiceCount(ch) {
    return ch.speakerIds.length + ch.audienceIds.length + (ch.extraListeners || 0);
  }

  function audienceShown(ch) {
    return ch.audienceIds.length + (ch.extraListeners || 0);
  }

  function speakingCount(community, ch) {
    return [...ch.speakerIds, ...ch.audienceIds].filter((id) => id !== "me" && resolve(community, id).speaking).length;
  }

  function displayOnline(community) {
    const named = community.people.filter((item) => ["online", "idle", "dnd"].includes(item.status) && item.timeoutUntil < Date.now()).length;
    return Math.max(named, community.onlineBase + named + community.onlineDrift);
  }

  function rateOf(community) {
    const cutoff = Date.now() - 60000;
    community.msgTimes = community.msgTimes.filter((ts) => ts >= cutoff);
    return community.msgTimes.length;
  }

  function communityUnread(community) {
    return community.channels.reduce((sum, ch) => sum + (ch.unread || 0), 0);
  }

  function inboxUnread() {
    return state.inbox.filter((item) => !item.read).length;
  }

  function openReports(community) {
    return community.reports.filter((item) => item.status === "open").length;
  }

  function formatText(text) {
    return escapeHtml(text).replace(/@([a-z0-9_]+)/gi, '<span class="mention">@$1</span>');
  }

  function logEvent(text) {
    state.feed.unshift({ at: Date.now(), text });
    state.feed.length = Math.min(state.feed.length, 10);
  }

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  function removeMe() {
    communities.forEach((community) => {
      community.channels.forEach((ch) => {
        if (ch.kind !== "voice") return;
        ch.speakerIds = ch.speakerIds.filter((id) => id !== "me");
        ch.audienceIds = ch.audienceIds.filter((id) => id !== "me");
      });
    });
  }

  function joinVoice(communityId, channelId) {
    const previous = state.voice;
    removeMe();
    const ch = getChannel(communityId, channelId);
    const video = previous ? previous.video : false;
    if (video) ch.speakerIds.push("me");
    else ch.audienceIds.unshift("me");
    state.voice = {
      communityId,
      channelId,
      muted: previous ? previous.muted : false,
      deafened: previous ? previous.deafened : false,
      video,
      hand: false,
    };
  }

  function leaveVoice() {
    removeMe();
    state.voice = null;
    toast("You left the voice room quietly");
    logEvent(`${current().name} · you left voice`);
    render();
  }

  function notify(entry, announce) {
    state.inbox.unshift(entry);
    state.inbox.length = Math.min(state.inbox.length, 30);
    if (announce && state.me.status !== "dnd") toast(entry.title);
    if (state.panel === "inbox") paintPanel();
    syncCounts();
  }

  function deliver(community, ch, message) {
    ch.messages.push(message);
    if (ch.messages.length > 80) ch.messages.shift();
    community.msgTimes.push(Date.now());
    const viewing =
      state.mode === "client" &&
      state.communityId === community.id &&
      state.channelId === ch.id &&
      ch.kind === "text";
    if (viewing) {
      state.typing = "";
      appendMessage(community, ch, message);
      const typing = document.getElementById("typing");
      if (typing) typing.textContent = "";
    } else if (ch.kind === "text" && message.authorId !== "me") {
      ch.unread += 1;
    }
    if (message.authorId !== "me" && /@ada\b|@everyone|@here/i.test(message.text)) {
      const who = resolve(community, message.authorId);
      notify(
        {
          id: uid("n"),
          kind: "mention",
          title: `${who.name} mentioned you in #${ch.name}`,
          body: message.text,
          communityId: community.id,
          channelId: ch.id,
          at: message.at,
          read: viewing,
        },
        true
      );
    }
    logEvent(`${community.name} · #${ch.name} · new message`);
    syncCounts();
    syncRail();
    if (state.mode === "fleet") paintFleet();
  }

  function appendMessage(community, ch, message) {
    const list = document.getElementById("messages");
    if (!list) return;
    const prev = ch.messages[ch.messages.length - 2];
    const compact = !!(prev && prev.authorId === message.authorId && !message.replyTo && message.at - prev.at < 5 * 60000);
    const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 140;
    list.insertAdjacentHTML("beforeend", messageHtml(community, message, compact));
    if (nearBottom || message.authorId === "me") list.scrollTop = list.scrollHeight;
  }

  function sendMessage() {
    const composer = document.getElementById("composer");
    const text = (composer ? composer.value : state.draft).trim();
    const ch = viewedChannel();
    const community = current();
    if (!text || !ch || ch.kind !== "text") return;
    const message = {
      id: uid("m"),
      authorId: "me",
      text,
      at: Date.now(),
      replyTo: state.reply ? state.reply.id : null,
    };
    state.reply = null;
    state.draft = "";
    if (composer) {
      composer.value = "";
      composer.style.height = "";
      composer.closest(".composer")?.classList.remove("has-text");
    }
    const bar = document.getElementById("reply-bar");
    if (bar) bar.remove();
    deliver(community, ch, message);
    if (Math.random() < 0.55) {
      const author = pickAuthor(community);
      if (author) {
        window.setTimeout(() => {
          const replyText = author.role === "mod" ? "Seen — I'll take it from here." : "Got it.";
          deliver(community, ch, {
            id: uid("m"),
            authorId: author.id,
            text: replyText,
            at: Date.now(),
            replyTo: message.id,
          });
        }, 1200);
      }
    }
  }

  function pickAuthor(community) {
    const pool = community.people.filter((item) => item.status === "online" && item.timeoutUntil < Date.now());
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function deleteMessage(community, channelId, messageId, reason) {
    const ch = community.channels.find((item) => item.id === channelId);
    if (!ch) return;
    ch.messages = ch.messages.filter((item) => item.id !== messageId);
    community.reports.forEach((report) => {
      if (report.messageId === messageId && report.status === "open") report.status = "resolved";
    });
    community.audit.unshift({ id: uid("a"), text: `${state.me.name} deleted a message in #${ch.name}`, at: Date.now() });
    logEvent(`${community.name} · #${ch.name} · message deleted`);
    const node = document.getElementById("msg-" + messageId);
    if (node) node.remove();
    toast(reason || "Message deleted");
    if (state.panel === "mod") paintPanel();
    syncCounts();
  }

  function timeoutAuthor(community, authorId) {
    const who = resolve(community, authorId);
    if (!who || authorId === "me") return;
    who.timeoutUntil = Date.now() + 10 * 60000;
    who.speaking = false;
    who.status = "timeout";
    community.channels.forEach((ch) => {
      if (ch.kind !== "voice") return;
      ch.speakerIds = ch.speakerIds.filter((id) => id !== authorId);
      ch.audienceIds = ch.audienceIds.filter((id) => id !== authorId);
    });
    community.audit.unshift({
      id: uid("a"),
      text: `${state.me.name} timed out ${who.name} for 10 minutes`,
      at: Date.now(),
    });
    logEvent(`${community.name} · ${who.name} timed out`);
    toast(`${who.name} is timed out for 10 minutes`);
    render();
  }

  function openChannel(communityId, channelId) {
    const community = communityById(communityId);
    const ch = community && community.channels.find((item) => item.id === channelId);
    if (!ch) return;
    const prev = viewedChannel();
    if (prev && prev !== ch) prev.newMarker = null;
    state.mode = "client";
    state.communityId = communityId;
    state.channelId = channelId;
    state.navOpen = false;
    state.peopleQuery = "";
    if (ch.kind === "text" && ch.unread) {
      ch.newMarker = Math.max(0, ch.messages.length - ch.unread);
      ch.unread = 0;
    }
    if (ch.kind === "voice") {
      const same = state.voice && state.voice.communityId === communityId && state.voice.channelId === channelId;
      if (!same) joinVoice(communityId, channelId);
    }
    render();
  }

  function paintRail() {
    railList.innerHTML = communities
      .map((community) => {
        const active = state.mode === "client" && state.communityId === community.id;
        const connected = state.voice && state.voice.communityId === community.id;
        const unread = communityUnread(community) > 0;
        return `<button class="server${active ? " active" : ""}${connected ? " connected" : ""}${unread ? " has-unread" : ""}" type="button" data-action="community" data-server="${community.id}" data-id="${community.id}" title="${escapeHtml(community.name)}" style="background:${community.color}"><small>${escapeHtml(community.mark)}</small></button>`;
      })
      .join("");
    document.querySelector(".brand")?.classList.toggle("active", state.mode === "fleet");
  }

  function syncRail() {
    document.querySelectorAll("[data-server]").forEach((button) => {
      const community = communityById(button.dataset.server);
      if (!community) return;
      button.classList.toggle("has-unread", communityUnread(community) > 0);
      button.classList.toggle("active", state.mode === "client" && state.communityId === community.id);
      button.classList.toggle("connected", !!(state.voice && state.voice.communityId === community.id));
    });
    document.querySelector(".brand")?.classList.toggle("active", state.mode === "fleet");
  }

  function occRow(community, id) {
    const who = resolve(community, id);
    const speaking = who.speaking && id !== "me" ? " speaking" : "";
    const muted = (id === "me" && state.voice && state.voice.muted) || who.micMuted;
    return `<div class="occ-row${speaking}" data-person="${escapeHtml(id)}"><span class="av">${avatar(id, 28)}${muted ? `<span class="mic-badge">${icon("micOff")}</span>` : ""}</span><span>${escapeHtml(id === "me" ? "Adaeze" : who.name.split(" ")[0])}</span></div>`;
  }

  function paintChannels() {
    if (state.mode === "fleet") {
      channelsEl.innerHTML = "";
      return;
    }
    const community = current();
    const sections = [];
    community.channels.forEach((ch) => {
      const last = sections[sections.length - 1];
      if (!last || last.name !== ch.section) sections.push({ name: ch.section, channels: [ch] });
      else last.channels.push(ch);
    });
    const lists = sections
      .map((section) => {
        const rows = section.channels
          .map((ch) => {
            const active = ch.id === state.channelId;
            if (ch.kind === "text") {
              const pill = ch.unread ? `<span class="pill" data-pill="${ch.id}">${ch.unread}</span>` : `<span class="pill" data-pill="${ch.id}" hidden></span>`;
              return `<button class="chan${active ? " active" : ""}${ch.unread ? " unread" : ""}" type="button" data-action="channel" data-id="${ch.id}" data-unread-for="${ch.id}"><span class="mark">#</span><span class="chan-name">${escapeHtml(ch.name)}</span>${pill}</button>`;
            }
            const expanded = active || (state.voice && state.voice.channelId === ch.id && state.voice.communityId === community.id);
            const people = expanded
              ? `<div class="occ">${ch.speakerIds.map((id) => occRow(community, id)).join("")}<div class="occ-more" data-aud="${community.id}/${ch.id}">${audienceShown(ch).toLocaleString("en-US")} listening</div></div>`
              : "";
            return `<button class="chan${active ? " active" : ""}" type="button" data-action="channel" data-id="${ch.id}"><span class="mark">${icon("wave")}</span><span class="chan-name">${escapeHtml(ch.name)}</span><span class="chan-count" data-listeners="${community.id}/${ch.id}">${voiceCount(ch).toLocaleString("en-US")}</span></button>${people}`;
          })
          .join("");
        return `<p class="section-label">${escapeHtml(section.name)}</p>${rows}`;
      })
      .join("");

    const voice = state.voice;
    const voiceCommunity = voice ? communityById(voice.communityId) : null;
    const voiceChannel = voice ? getChannel(voice.communityId, voice.channelId) : null;
    const dock = voice
      ? `<div class="dock${voice.muted ? " muted" : ""}${voice.deafened ? " deaf" : ""}">
          <div class="dock-copy">
            <strong><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span id="dock-label">${voice.deafened ? "Deafened" : voice.muted ? "Muted" : "Voice connected"}</span></strong>
            <button type="button" data-action="channel" data-community="${voice.communityId}" data-id="${voice.channelId}">${escapeHtml(voiceCommunity.name)} / ${escapeHtml(voiceChannel.name)}</button>
          </div>
        </div>`
      : "";
    const pop = state.settingsOpen
      ? `<div class="popover" id="settings-pop" role="menu">
          ${["online", "idle", "dnd", "invisible"].map((status) => `<button type="button" role="menuitemradio" aria-checked="${state.me.status === status}" data-action="status" data-id="${status}"><i class="dot ${status}"></i>${labelStatus(status)}</button>`).join("")}
        </div>`
      : "";
    channelsEl.innerHTML = `
      <div class="banner" aria-hidden="true"><div class="banner-copy"><strong>${escapeHtml(community.name)}</strong><span data-sync="members">${community.members.toLocaleString("en-US")} members</span></div></div>
      <div class="channel-scroll">${lists}</div>
      <div class="foot">
        ${pop}
        ${dock}
        <div class="me-row">
          <div class="me-av">${avatar("me", 36)}<i class="status ${escapeHtml(state.me.status)}"></i></div>
          <div class="me-copy">
            <strong>Adaeze</strong>
            <span>@${escapeHtml(state.me.handle)}</span>
          </div>
          <button class="icon-btn" type="button" data-action="mute" aria-pressed="${voice ? voice.muted : false}" aria-label="${voice && voice.muted ? "Unmute microphone" : "Mute microphone"}">${icon(voice && voice.muted ? "micOff" : "mic")}</button>
          <button class="icon-btn" type="button" data-action="deafen" aria-pressed="${voice ? voice.deafened : false}" aria-label="${voice && voice.deafened ? "Undeafen" : "Deafen"}">${icon(voice && voice.deafened ? "headphonesOff" : "headphones")}</button>
          <button class="icon-btn" type="button" data-action="settings" aria-expanded="${state.settingsOpen}" aria-label="Set presence">${icon("gear")}</button>
        </div>
      </div>`;
  }

  function labelStatus(status) {
    if (status === "dnd") return "Do not disturb";
    if (status === "invisible") return "Invisible";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function headerActions() {
    const community = current();
    const inbox = inboxUnread();
    const mods = openReports(community);
    return `<div class="top-actions">
      <button class="icon-btn only-mobile" type="button" data-action="toggle-nav" aria-label="Channels">${icon("menu")}</button>
      <button class="icon-btn" type="button" data-action="panel" data-id="people" aria-pressed="${state.panel === "people"}" aria-label="People">${icon("people")}</button>
      <button class="icon-btn" type="button" data-action="panel" data-id="inbox" aria-pressed="${state.panel === "inbox"}" aria-label="Notifications">${icon("bell")}${inbox ? `<span class="badge" data-sync="inbox">${inbox > 9 ? "9+" : inbox}</span>` : `<span class="badge" data-sync="inbox" hidden></span>`}</button>
      <button class="icon-btn" type="button" data-action="panel" data-id="mod" aria-pressed="${state.panel === "mod"}" aria-label="Moderation">${icon("shield")}${mods ? `<span class="badge" data-sync="mod">${mods}</span>` : `<span class="badge" data-sync="mod" hidden></span>`}</button>
    </div>`;
  }

  function messageHtml(community, message, compact) {
    const who = resolve(community, message.authorId);
    const reply = message.replyTo ? findMessage(community, message.replyTo) : null;
    const replyHtml = reply
      ? `<p class="quote">${escapeHtml(resolve(community, reply.message.authorId).name)}: ${escapeHtml(reply.message.text)}</p>`
      : "";
    const canDelete = community.mod || message.authorId === "me";
    const tools = `<div class="tools">
      ${message.authorId !== "me" ? `<button type="button" data-action="reply" data-id="${message.id}" aria-label="Reply to ${escapeHtml(who.name)}">${icon("reply")}</button>` : ""}
      ${message.authorId !== "me" ? `<button type="button" data-action="report" data-id="${message.id}" aria-label="Report message">${icon("flag")}</button>` : ""}
      ${canDelete ? `<button class="danger" type="button" data-action="delete" data-id="${message.id}" aria-label="Delete message">${icon("trash")}</button>` : ""}
    </div>`;
    return `<article class="msg${compact ? " compact" : ""}" id="msg-${message.id}">
      <div class="msg-av">${compact ? "" : avatar(message.authorId, 40)}</div>
      <div>
        <div class="msg-head"><span class="author${who.role === "mod" ? " mod" : ""}">${escapeHtml(who.name)}</span><time class="time">${clock(message.at)}</time></div>
        ${replyHtml}
        <p class="msg-text">${formatText(message.text)}</p>
      </div>
      ${tools}
    </article>`;
  }

  function paintVoice(community, ch) {
    const connected = state.voice && state.voice.communityId === community.id && state.voice.channelId === ch.id;
    const speakers = ch.speakerIds
      .map((id, index) => {
        const who = resolve(community, id);
        const video = id === "me" ? state.voice && state.voice.video : who.video;
        const tile = video ? "#1b2030" : TILES[index % TILES.length];
        const speaking = who.speaking && id !== "me" ? " speaking" : "";
        const face = video
          ? `<div class="scene"></div><span class="video-chip">Video</span>`
          : `<div class="face">${avatar(id, 120)}</div>`;
        const name = id === "me" ? "You" : who.name.split(" ")[0];
        return `<article class="speaker${speaking}${video ? " video" : ""}" data-person="${escapeHtml(id)}" style="--tile:${tile}">
          ${face}
          <div class="namepill"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span>${escapeHtml(name)}</span></div>
        </article>`;
      })
      .join("");
    const audience = ch.audienceIds
      .map((id) => {
        const who = resolve(community, id);
        const self = id === "me";
        const speaking = who.speaking && !self ? " speaking" : "";
        const muted = (self && state.voice && state.voice.muted) || who.micMuted;
          const hand = self && state.voice && state.voice.hand;
          return `<div class="aud${self ? " self" : ""}${speaking}" data-person="${escapeHtml(id)}">
          <div class="aud-face">${avatar(id, 64)}${hand ? `<span class="hand-flag" aria-label="Hand raised">${icon("hand")}</span>` : ""}${muted ? `<span class="mic-badge">${icon("micOff")}</span>` : ""}</div>
          <div class="who">${escapeHtml(self ? "You" : who.name.split(" ")[0])}</div>
        </div>`;
      })
      .join("");
    const extra = ch.extraListeners
      ? `<div class="more-tile" data-aud="${community.id}/${ch.id}">+${ch.extraListeners.toLocaleString("en-US")} listening</div>`
      : "";
    const controls = connected
      ? `<button class="ctrl" type="button" data-action="hand" aria-pressed="${state.voice.hand}" aria-label="${state.voice.hand ? "Lower hand" : "Raise hand"}">${icon("hand")}</button>
         <button class="ctrl" type="button" data-action="invite" aria-label="Copy invite">${icon("plus")}</button>
         <button class="ctrl" type="button" data-action="video" aria-pressed="${state.voice.video}" aria-label="${state.voice.video ? "Turn camera off" : "Turn camera on"}">${icon("video")}</button>
         <button class="exit" type="button" data-action="leave">Exit quietly <span aria-hidden="true">→</span></button>`
      : `<button class="join" type="button" data-action="join">Join ${escapeHtml(ch.name)}</button>`;
    stageEl.innerHTML = `<div class="top">
        <div class="top-id"><span class="wave">${icon("wave")}</span><div><strong>${escapeHtml(ch.name)}</strong><p class="topic">${escapeHtml(ch.topic)}</p></div></div>
        ${headerActions()}
      </div>
      <div class="voice-layout">
        <div class="voice-intro">
          <h2>${escapeHtml(ch.topic)}</h2>
          <p id="voice-stats">${voiceCount(ch).toLocaleString("en-US")} people · ${speakingCount(community, ch)} speaking</p>
        </div>
        <div class="speakers">${speakers}</div>
        <h3 class="aud-label">Audience — <span id="aud-count">${audienceShown(ch).toLocaleString("en-US")}</span></h3>
        <div class="audience">${audience}${extra}</div>
      </div>
      <div class="stage-controls">${controls}</div>`;
  }

  function paintText(community, ch) {
    const blocks = [`<div class="day">${escapeHtml(dayLabel())}</div>`];
    ch.messages.forEach((message, index) => {
      if (ch.newMarker != null && index === ch.newMarker && ch.newMarker > 0) blocks.push('<div class="newbar">New</div>');
      const prev = ch.messages[index - 1];
      const compact = !!(prev && prev.authorId === message.authorId && !message.replyTo && message.at - prev.at < 5 * 60000 && index !== ch.newMarker);
      blocks.push(messageHtml(community, message, compact));
    });
    const reply = state.reply
      ? `<div class="reply-bar" id="reply-bar"><span>Replying to <strong>${escapeHtml(state.reply.name)}</strong> — ${escapeHtml(state.reply.excerpt)}</span><button type="button" data-action="cancel-reply" aria-label="Cancel reply">${icon("close")}</button></div>`
      : "";
    stageEl.innerHTML = `<div class="top">
        <div class="top-id"><span class="hash">#</span><div><strong>${escapeHtml(ch.name)}</strong><p class="topic">${escapeHtml(ch.topic)}</p></div></div>
        ${headerActions()}
      </div>
      <div class="messages" id="messages">${blocks.join("")}</div>
      <div class="typing" id="typing">${escapeHtml(state.typing)}</div>
      <form class="composer-wrap" id="composer-form">
        ${reply}
        <div class="composer${state.draft.trim() ? " has-text" : ""}">
          <label class="sr-only" for="composer" style="position:absolute;width:1px;height:1px;overflow:hidden">Message</label>
          <textarea id="composer" rows="1" placeholder="Message #${escapeHtml(ch.name)}" maxlength="500">${escapeHtml(state.draft)}</textarea>
          <button class="send" type="submit" aria-label="Send message">${icon("send")}</button>
        </div>
      </form>`;
    const list = document.getElementById("messages");
    if (list) list.scrollTop = list.scrollHeight;
  }

  function spark(series) {
    const w = 180;
    const h = 36;
    const max = Math.max(...series, 1);
    const min = Math.min(...series, 0);
    const span = max - min || 1;
    const points = series.map((value, index) => {
      const x = (index / (series.length - 1)) * (w - 4) + 2;
      const y = h - 4 - ((value - min) / span) * (h - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="M${points.join(" L")}"/></svg>`;
  }

  function paintFleet() {
    const members = communities.reduce((sum, community) => sum + community.members, 0);
    const online = communities.reduce((sum, community) => sum + displayOnline(community), 0);
    const voice = communities.reduce(
      (sum, community) => sum + community.channels.filter((ch) => ch.kind === "voice").reduce((inner, ch) => inner + voiceCount(ch), 0),
      0
    );
    const rate = communities.reduce((sum, community) => sum + rateOf(community), 0);
    const reports = communities.reduce((sum, community) => sum + openReports(community), 0);
    const cards = communities
      .map((community) => {
        const inVoice = community.channels.filter((ch) => ch.kind === "voice").reduce((sum, ch) => sum + voiceCount(ch), 0);
        return `<button class="community-card" type="button" data-action="community" data-id="${community.id}">
          <div class="card-top"><span class="server" style="background:${community.color}"><small>${escapeHtml(community.mark)}</small></span><div><strong>${escapeHtml(community.name)}</strong><span>${community.members.toLocaleString("en-US")} members</span></div></div>
          <div class="statline"><span>${displayOnline(community).toLocaleString("en-US")} online</span><span>${inVoice.toLocaleString("en-US")} in voice</span></div>
          <div class="statline"><span>${rateOf(community).toLocaleString("en-US")} msg/min</span><span>${openReports(community)} open reports</span></div>
          ${spark(community.rateSeries)}
        </button>`;
      })
      .join("");
    const feed = state.feed
      .map((item) => `<li><time>${clock(item.at)}</time><span>${escapeHtml(item.text)}</span></li>`)
      .join("");
    stageEl.innerHTML = `<div class="fleet">
      <div class="fleet-head">
        <h2>Communities on one clock</h2>
        <p>Messages, presence, voice, notifications, and moderation are moving in every room during this session. Opening one community does not pause the others.</p>
      </div>
      <div class="kpis">
        <article class="kpi"><span>Communities</span><strong>${communities.length}</strong></article>
        <article class="kpi"><span>Members</span><strong>${members.toLocaleString("en-US")}</strong></article>
        <article class="kpi"><span>Online</span><strong>${online.toLocaleString("en-US")}</strong></article>
        <article class="kpi"><span>In voice</span><strong>${voice.toLocaleString("en-US")}</strong></article>
        <article class="kpi"><span>Messages/min</span><strong>${rate.toLocaleString("en-US")}</strong></article>
        <article class="kpi"><span>Open reports</span><strong>${reports}</strong></article>
      </div>
      <div class="fleet-grid">
        <div class="cards">${cards}</div>
        <aside class="feed">
          <h3>Live across communities</h3>
          <ol>${feed}</ol>
        </aside>
      </div>
    </div>`;
  }

  function peopleListHtml(community) {
    const query = state.peopleQuery.trim().toLowerCase();
    const mePerson = resolve(community, "me");
    const roster = [mePerson, ...community.people];
    const groups = [
      ["online", "Online"],
      ["idle", "Idle"],
      ["dnd", "Do not disturb"],
      ["timeout", "Timed out"],
      ["offline", "Offline"],
      ["invisible", "Invisible"],
    ];
    const html = groups
      .map(([key, label]) => {
        const rows = roster.filter((item) => {
          const timed = item.timeoutUntil > Date.now();
          const status = timed ? "timeout" : item.id === "me" ? state.me.status : item.status;
          if (status !== key) return false;
          if (!query) return true;
          return item.name.toLowerCase().includes(query) || item.handle.toLowerCase().includes(query);
        });
        if (!rows.length) return "";
        const items = rows
          .map((item) => {
            const activity = item.timeoutUntil > Date.now()
              ? "Timed out · 10m"
              : voiceActivity(community, item.id) || item.activity || (item.id === "me" ? "You" : "");
            return `<div class="person"><span class="av">${avatar(item.id, 32)}<i class="status ${item.timeoutUntil > Date.now() ? "timeout" : item.id === "me" ? state.me.status : item.status}"></i></span><div class="meta"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(activity || "@" + item.handle)}</span></div></div>`;
          })
          .join("");
        return `<p class="group-label">${label} — ${rows.length}</p>${items}`;
      })
      .join("");
    const more = Math.max(0, displayOnline(community) - roster.filter((item) => ["online", "idle", "dnd"].includes(item.id === "me" ? state.me.status : item.status)).length);
    return html + (query ? "" : `<p class="empty">and ${more.toLocaleString("en-US")} more online across ${escapeHtml(community.name)}.</p>`);
  }

  function voiceActivity(community, id) {
    for (const ch of community.channels) {
      if (ch.kind === "voice" && (ch.speakerIds.includes(id) || ch.audienceIds.includes(id))) return `In voice · ${ch.name}`;
    }
    return "";
  }

  function paintPanel() {
    if (state.mode !== "client" || !state.panel) {
      panelEl.innerHTML = "";
      return;
    }
    const community = current();
    let body = "";
    if (state.panel === "people") {
      body = `<input class="filter" id="people-filter" type="search" placeholder="Search people" value="${escapeHtml(state.peopleQuery)}" /><div id="people-list">${peopleListHtml(community)}</div>`;
    } else if (state.panel === "inbox") {
      const items = state.inbox
        .map(
          (item) => `<article class="note${item.read ? "" : " unread"}">
            <header><span class="kind">${escapeHtml(item.kind)}</span><span class="when">${rel(item.at)}</span></header>
            <p><strong>${escapeHtml(item.title)}</strong></p>
            <p>${escapeHtml(item.body)}</p>
            <div class="row-actions"><button class="btn" type="button" data-action="notif" data-id="${item.id}">Open</button></div>
          </article>`
        )
        .join("");
      body = `<div class="row-actions" style="margin-bottom:0.6rem"><button class="btn ghost" type="button" data-action="read-all">Mark all read</button></div>${items || '<p class="empty">You are caught up.</p>'}`;
    } else {
      const reports = community.reports.filter((item) => item.status === "open");
      const cards = reports
        .map((report) => {
          const actions = community.mod
            ? `<div class="row-actions">
                <button class="btn danger" type="button" data-action="mod-delete" data-id="${report.id}">Delete message</button>
                <button class="btn" type="button" data-action="mod-timeout" data-id="${report.id}">Timeout 10m</button>
                <button class="btn ghost" type="button" data-action="mod-dismiss" data-id="${report.id}">Dismiss</button>
              </div>`
            : `<p class="when">Moderators of ${escapeHtml(community.name)} handle this queue.</p>`;
          return `<article class="report">
            <header><span class="kind">${escapeHtml(report.reason)}</span><span class="when">${rel(report.at)}</span></header>
            <p><strong>${escapeHtml(report.authorName)}</strong> in #${escapeHtml(report.channelId)}</p>
            <p>${escapeHtml(report.excerpt)}</p>
            <p class="when">Reported by ${escapeHtml(report.reporter)}</p>
            ${actions}
          </article>`;
        })
        .join("");
      const audit = community.audit
        .slice(0, 6)
        .map((item) => `<article class="audit-item"><p>${escapeHtml(item.text)}</p><p class="when">${rel(item.at)}</p></article>`)
        .join("");
      body = `${cards || '<p class="empty">No open reports in this community.</p>'}<p class="group-label">Audit</p>${audit || '<p class="empty">No recent actions.</p>'}`;
    }
    const titles = { people: "People", inbox: "Notifications", mod: "Moderation" };
    panelEl.innerHTML = `<div class="panel-head"><h2>${titles[state.panel]}</h2><button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close panel">${icon("close")}</button></div><div class="panel-body">${body}</div>`;
  }

  function paintStage() {
    if (state.mode === "fleet") {
      paintFleet();
      document.title = "All communities — Hearth";
      return;
    }
    const community = current();
    const ch = viewedChannel();
    if (!ch) return;
    if (ch.kind === "voice") paintVoice(community, ch);
    else paintText(community, ch);
    document.title = (ch.kind === "text" ? "#" : "") + ch.name + " — Hearth";
  }

  function render() {
    appEl.classList.toggle("is-fleet", state.mode === "fleet");
    appEl.classList.toggle("panel-open", state.mode === "client" && !!state.panel);
    appEl.classList.toggle("nav-open", state.navOpen);
    paintRail();
    paintChannels();
    paintStage();
    paintPanel();
  }

  function syncCounts() {
    const community = current();
    document.querySelectorAll("[data-listeners]").forEach((el) => {
      const [communityId, channelId] = el.dataset.listeners.split("/");
      const ch = getChannel(communityId, channelId);
      if (ch) el.textContent = voiceCount(ch).toLocaleString("en-US");
    });
    document.querySelectorAll("[data-aud]").forEach((el) => {
      const [communityId, channelId] = el.dataset.aud.split("/");
      const ch = getChannel(communityId, channelId);
      if (!ch) return;
      if (el.classList.contains("more-tile")) el.textContent = `+${ch.extraListeners.toLocaleString("en-US")} listening`;
      else if (el.classList.contains("occ-more")) el.textContent = `${audienceShown(ch).toLocaleString("en-US")} listening`;
    });
    document.querySelectorAll("[data-pill]").forEach((el) => {
      const ch = community.channels.find((item) => item.id === el.dataset.pill);
      if (!ch) return;
      el.hidden = !ch.unread;
      el.textContent = ch.unread ? String(ch.unread) : "";
      el.closest(".chan")?.classList.toggle("unread", ch.unread > 0);
    });
    const inbox = inboxUnread();
    document.querySelectorAll("[data-sync='inbox']").forEach((el) => {
      el.hidden = inbox === 0;
      el.textContent = inbox > 9 ? "9+" : String(inbox);
    });
    const mods = openReports(community);
    document.querySelectorAll("[data-sync='mod']").forEach((el) => {
      el.hidden = mods === 0;
      el.textContent = mods ? String(mods) : "";
    });
    const stats = document.getElementById("voice-stats");
    const ch = viewedChannel();
    if (stats && ch && ch.kind === "voice") {
      stats.textContent = `${voiceCount(ch).toLocaleString("en-US")} people · ${speakingCount(community, ch)} speaking`;
    }
    const aud = document.getElementById("aud-count");
    if (aud && ch && ch.kind === "voice") aud.textContent = audienceShown(ch).toLocaleString("en-US");
  }

  function syncSpeaking() {
    document.querySelectorAll("[data-person]").forEach((el) => {
      const personRecord = findPerson(el.dataset.person);
      const on = !!(personRecord && personRecord.speaking && el.dataset.person !== "me");
      el.classList.toggle("speaking", on);
    });
    syncCounts();
  }

  function rotateSpeaking() {
    communities.forEach((community) => {
      community.channels.forEach((ch) => {
        if (ch.kind !== "voice") return;
        const ids = [...ch.speakerIds, ...ch.audienceIds].filter((id) => id !== "me");
        ids.forEach((id) => {
          const record = findPerson(id);
          if (record) record.speaking = false;
        });
        const want = Math.min(ch.speakerIds.length ? 3 : 1, ids.length);
        const pool = [...ids].sort(() => Math.random() - 0.5).slice(0, want);
        pool.forEach((id) => {
          const record = findPerson(id);
          if (record && record.timeoutUntil < Date.now()) record.speaking = true;
        });
      });
    });
    syncSpeaking();
  }

  function planMessage() {
    const community = communities[Math.floor(Math.random() * communities.length)];
    const texts = community.channels.filter((ch) => ch.kind === "text");
    const ch = texts[Math.floor(Math.random() * texts.length)];
    const author = pickAuthor(community);
    if (!ch || !author) return null;
    const mention = Math.random() < 0.22 && (community.id === "northwind" || community.id === "lagos");
    const text = mention ? MENTIONS[Math.floor(Math.random() * MENTIONS.length)] : AMBIENT[Math.floor(Math.random() * AMBIENT.length)];
    return { community, channel: ch, author, text };
  }

  function maybeReport() {
    const community = communities.filter((item) => item.mod)[Math.floor(Math.random() * 2)];
    if (!community || openReports(community) >= 3) return;
    const ch = community.channels.find((item) => item.kind === "text" && item.messages.length);
    if (!ch) return;
    const message = ch.messages[ch.messages.length - 1];
    if (!message || message.authorId === "me") return;
    if (community.reports.some((item) => item.messageId === message.id && item.status === "open")) return;
    const who = resolve(community, message.authorId);
    community.reports.unshift({
      id: uid("r"),
      messageId: message.id,
      channelId: ch.id,
      authorId: message.authorId,
      authorName: who.name,
      reporter: "Amaka Diallo",
      reason: "Needs a look",
      excerpt: message.text,
      status: "open",
      at: Date.now(),
    });
    logEvent(`${community.name} · new report in #${ch.name}`);
    if (state.communityId === community.id && state.me.status !== "dnd") toast(`New report in ${community.name}`);
    if (state.panel === "mod" && state.communityId === community.id) paintPanel();
    syncCounts();
  }

  function tick() {
    rotateSpeaking();
    communities.forEach((community) => {
      community.onlineDrift = Math.max(-25, Math.min(25, community.onlineDrift + (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 3)));
      const rate = rateOf(community);
      community.rateSeries.push(rate);
      if (community.rateSeries.length > 16) community.rateSeries.shift();
      community.channels.forEach((ch) => {
        if (!ch.flexListeners) return;
        const delta = Math.random() < 0.5 ? -1 : 1;
        ch.extraListeners = Math.max(ch.flexMin, Math.min(ch.flexMax, ch.extraListeners + delta));
      });
    });
    if (Math.random() < 0.7) {
      const plan = planMessage();
      if (plan) {
        const viewing = state.mode === "client" && state.communityId === plan.community.id && state.channelId === plan.channel.id;
        if (viewing) {
          state.typing = `${plan.author.name.split(" ")[0]} is typing…`;
          const typing = document.getElementById("typing");
          if (typing) typing.textContent = state.typing;
        }
        window.clearTimeout(typingTimer);
        typingTimer = window.setTimeout(() => {
          deliver(plan.community, plan.channel, {
            id: uid("m"),
            authorId: plan.author.id,
            text: plan.text,
            at: Date.now(),
            replyTo: null,
          });
        }, viewing ? 700 : 40);
      }
    }
    if (Math.random() < 0.18) maybeReport();
    syncCounts();
    syncRail();
    if (state.mode === "fleet") paintFleet();
  }

  function showReply(community, messageId) {
    const found = findMessage(community, messageId);
    if (!found) return;
    const who = resolve(community, found.message.authorId);
    state.reply = { id: messageId, name: who.name, excerpt: found.message.text.slice(0, 80) };
    render();
    document.getElementById("composer")?.focus();
  }

  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) {
      if (state.settingsOpen && !event.target.closest(".popover")) {
        state.settingsOpen = false;
        paintChannels();
      }
      return;
    }
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "fleet") {
      state.mode = "fleet";
      state.panel = null;
      state.navOpen = false;
      state.settingsOpen = false;
      render();
      return;
    }
    if (action === "community") {
      const community = communityById(id);
      if (!community) return;
      if (state.mode === "client" && state.communityId === community.id) return;
      if (state.voice && state.voice.communityId === community.id) {
        openChannel(community.id, state.voice.channelId);
        return;
      }
      const fullest = [...community.channels]
        .filter((ch) => ch.kind === "voice")
        .sort((a, b) => voiceCount(b) - voiceCount(a))[0];
      openChannel(community.id, (fullest || community.channels[0]).id);
      return;
    }
    if (action === "channel") {
      openChannel(button.dataset.community || state.communityId, id);
      return;
    }
    if (action === "panel") {
      state.panel = state.panel === id ? null : id;
      state.navOpen = false;
      render();
      return;
    }
    if (action === "close-overlay") {
      state.panel = null;
      state.navOpen = false;
      render();
      return;
    }
    if (action === "toggle-nav") {
      state.navOpen = !state.navOpen;
      state.panel = null;
      render();
      return;
    }
    if (action === "settings") {
      state.settingsOpen = !state.settingsOpen;
      paintChannels();
      return;
    }
    if (action === "status") {
      state.me.status = id;
      state.settingsOpen = false;
      toast(id === "dnd" ? "Do not disturb — mention alerts stay quiet" : `Presence set to ${labelStatus(id).toLowerCase()}`);
      logEvent(`Northwind · Adaeze is ${labelStatus(id).toLowerCase()}`);
      render();
      return;
    }
    if (action === "mute") {
      if (!state.voice) {
        toast("Join a voice room first");
        return;
      }
      state.voice.muted = !state.voice.muted;
      render();
      return;
    }
    if (action === "deafen") {
      if (!state.voice) {
        toast("Join a voice room first");
        return;
      }
      state.voice.deafened = !state.voice.deafened;
      if (state.voice.deafened) state.voice.muted = true;
      render();
      return;
    }
    if (action === "video") {
      if (!state.voice) return;
      state.voice.video = !state.voice.video;
      const ch = getChannel(state.voice.communityId, state.voice.channelId);
      ch.speakerIds = ch.speakerIds.filter((item) => item !== "me");
      ch.audienceIds = ch.audienceIds.filter((item) => item !== "me");
      if (state.voice.video) ch.speakerIds.push("me");
      else ch.audienceIds.unshift("me");
      toast(state.voice.video ? "Camera on" : "Camera off");
      render();
      return;
    }
    if (action === "hand") {
      if (!state.voice) return;
      state.voice.hand = !state.voice.hand;
      toast(state.voice.hand ? "Hand raised" : "Hand lowered");
      render();
      return;
    }
    if (action === "invite") {
      const ch = viewedChannel();
      const link = `hearth.app/${state.communityId}/${ch ? ch.id : "room"}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).catch(() => {});
      }
      toast(`Invite copied — ${link}`);
      return;
    }
    if (action === "leave") {
      leaveVoice();
      return;
    }
    if (action === "join") {
      const ch = viewedChannel();
      if (ch && ch.kind === "voice") openChannel(state.communityId, ch.id);
      return;
    }
    if (action === "reply") {
      showReply(current(), id);
      return;
    }
    if (action === "cancel-reply") {
      state.reply = null;
      render();
      return;
    }
    if (action === "report") {
      const community = current();
      const found = findMessage(community, id);
      if (!found) return;
      if (community.reports.some((item) => item.messageId === id && item.status === "open")) {
        toast("Already in the moderation queue");
        return;
      }
      const who = resolve(community, found.message.authorId);
      community.reports.unshift({
        id: uid("r"),
        messageId: id,
        channelId: found.channel.id,
        authorId: found.message.authorId,
        authorName: who.name,
        reporter: state.me.name,
        reason: "Reported message",
        excerpt: found.message.text,
        status: "open",
        at: Date.now(),
      });
      toast("Sent to moderators");
      logEvent(`${community.name} · report in #${found.channel.name}`);
      syncCounts();
      if (state.panel === "mod") paintPanel();
      return;
    }
    if (action === "delete") {
      const community = current();
      const found = findMessage(community, id);
      if (!found) return;
      deleteMessage(community, found.channel.id, id);
      return;
    }
    if (action === "mod-delete" || action === "mod-timeout" || action === "mod-dismiss") {
      const community = current();
      const report = community.reports.find((item) => item.id === id);
      if (!report) return;
      if (action === "mod-dismiss") {
        report.status = "resolved";
        community.audit.unshift({ id: uid("a"), text: `${state.me.name} dismissed a report in #${report.channelId}`, at: Date.now() });
        toast("Report dismissed");
        paintPanel();
        syncCounts();
        return;
      }
      if (action === "mod-delete") deleteMessage(community, report.channelId, report.messageId, "Message removed");
      if (action === "mod-timeout") {
        report.status = "resolved";
        timeoutAuthor(community, report.authorId);
      }
      return;
    }
    if (action === "notif") {
      const item = state.inbox.find((entry) => entry.id === id);
      if (!item) return;
      item.read = true;
      state.panel = null;
      openChannel(item.communityId, item.channelId);
      return;
    }
    if (action === "read-all") {
      state.inbox.forEach((item) => {
        item.read = true;
      });
      paintPanel();
      syncCounts();
    }
  });

  document.body.addEventListener("submit", (event) => {
    if (event.target.id !== "composer-form") return;
    event.preventDefault();
    sendMessage();
  });

  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state.panel = null;
      state.navOpen = false;
      state.settingsOpen = false;
      render();
    }
    if (event.target.id === "composer" && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  document.body.addEventListener("input", (event) => {
    if (event.target.id === "composer") {
      state.draft = event.target.value;
      event.target.style.height = "auto";
      event.target.style.height = Math.min(event.target.scrollHeight, 120) + "px";
      event.target.closest(".composer")?.classList.toggle("has-text", event.target.value.trim().length > 0);
    }
    if (event.target.id === "people-filter") {
      state.peopleQuery = event.target.value;
      const list = document.getElementById("people-list");
      if (list) list.innerHTML = peopleListHtml(current());
    }
  });

  render();
  window.setTimeout(() => window.setInterval(tick, 2800), 1500);
})();
