/* 567811 — UI, forms, ads, video, donations */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- nav ---------- */
  var mb = $(".menu-btn"), nav = $(".nav");
  if (mb && nav) {
    mb.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", o);
      mb.textContent = o ? "✕" : "☰ Menu";
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); }); });
  }
  var here = location.href.split(/[?#]/)[0].replace(/\/$/, "/index.html");
  $$(".nav a:not(.btn)").forEach(function (a) { if (a.href.split(/[?#]/)[0] === here) a.setAttribute("aria-current", "page"); });
  $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("on"); }, 3800);
  }
  window.toast567 = toast;

  /* ---------- analytics ---------- */
  if (S.GA4) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + S.GA4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", S.GA4);
  }
  function track(ev, p) { if (window.gtag) gtag("event", ev, p || {}); }

  /* ---------- ads ---------- */
  var HOUSE = [
    ["Your brand here", "Reach dancers, studios & wedding couples worldwide.", "advertise.html", "See rate card"],
    ["Sponsor the 11-Count Challenge", "Put your brand on the monthly dance contest.", "contests.html#sponsor", "Become a sponsor"],
    ["Are you a choreographer?", "Get matched with clients looking for you.", "for-pros.html", "Join as a pro"],
    ["Keep 567811 free", "Support tools, prizes and new tutorials.", "donate.html", "Support us"]
  ];
  var root = (document.body.getAttribute("data-root") || "");
  $$(".ad .box").forEach(function (b, i) {
    if (S.ADSENSE_CLIENT) {
      var slot = S.AD_SLOTS && S.AD_SLOTS[b.getAttribute("data-slot") || "inContent"];
      b.innerHTML = '<span class="k">Advertisement</span><ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="' + S.ADSENSE_CLIENT + '"' + (slot ? ' data-ad-slot="' + slot + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    } else {
      var h = HOUSE[i % HOUSE.length];
      b.innerHTML = '<span class="k">Sponsored · house ad</span><strong>' + h[0] + '</strong><span class="mute small">' + h[1] + '</span><a class="btn sm ghost" href="' + root + h[2] + '">' + h[3] + "</a>";
    }
  });
  if (S.ADSENSE_CLIENT) {
    var a = document.createElement("script"); a.async = true; a.crossOrigin = "anonymous";
    a.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.ADSENSE_CLIENT;
    document.head.appendChild(a);
  }

  /* ---------- video ---------- */
  var CURATED = [
    ["Basics", "how to count 8 counts in dance beginner"], ["Hip Hop", "hip hop dance tutorial beginner"],
    ["Bollywood", "bollywood dance tutorial step by step"], ["Contemporary", "contemporary dance tutorial beginner"],
    ["Ballet", "beginner ballet barre class at home"], ["Jazz", "jazz dance tutorial beginner"],
    ["Salsa", "salsa basic step tutorial"], ["Bachata", "bachata basic step tutorial"],
    ["K-Pop", "kpop dance tutorial mirrored slow"], ["Ballroom", "wedding first dance tutorial easy"],
    ["Bhangra", "bhangra dance tutorial beginner steps"], ["Dance Fitness", "11 minute dance workout beginner"],
    ["Sangeet", "sangeet choreography family dance tutorial"], ["Freestyle", "how to freestyle dance grooves"]
  ];
  function lite(el, id, title) {
    el.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    el.setAttribute("aria-label", "Play: " + title);
    el.addEventListener("click", function () {
      el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + title.replace(/"/g, "") + '" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';
      track("video_play", { id: id });
    }, { once: true });
  }
  $$("[data-videos]").forEach(function (box) {
    var n = parseInt(box.getAttribute("data-videos"), 10) || 6, filt = box.getAttribute("data-style");
    var vids = (S.VIDEOS || []).filter(function (v) { return !filt || v.style === filt; });
    var html = "";
    if (vids.length) {
      vids.slice(0, n).forEach(function (v, i) {
        html += '<div class="vcard"><button class="vthumb" data-yt="' + v.id + '" data-t="' + (v.title || "") + '"></button><div class="b"><span class="tag">' + (v.style || "Tutorial") + "</span><h3>" + v.title + "</h3></div></div>";
      });
    } else {
      CURATED.filter(function (c) { return !filt || c[0] === filt; }).slice(0, n).forEach(function (c) {
        html += '<a class="vcard card" style="padding:0" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(c[1]) + '"><div class="vph">' + c[0] + '</div><div class="b"><span class="tag">' + c[0] + "</span><h3>Top " + c[0] + ' tutorials</h3><p class="small">Curated YouTube search · opens in a new tab</p></div></a>';
      });
    }
    box.innerHTML = html;
    $$("[data-yt]", box).forEach(function (b) { lite(b, b.getAttribute("data-yt"), b.getAttribute("data-t")); });
  });
  $$("[data-yt-channel]").forEach(function (a) { if (S.YOUTUBE_CHANNEL) a.href = S.YOUTUBE_CHANNEL; else a.href = "https://www.youtube.com/results?search_query=dance+count+in+5+6+7+8"; });

  /* ---------- donations ---------- */
  var D = S.DONATE || {}, dl = $("[data-donate-links]");
  if (dl) {
    var names = { paypal: "PayPal", kofi: "Ko-fi", bmac: "Buy Me a Coffee", stripe: "Card (Stripe)", patreon: "Patreon (monthly)" }, out = "";
    Object.keys(names).forEach(function (k) { if (D[k]) out += '<a class="btn" target="_blank" rel="noopener" href="' + D[k] + '">' + names[k] + "</a> "; });
    dl.innerHTML = out || '<p class="mute">Payment buttons are being connected. Use the pledge form below — we\'ll send a secure payment link within 24 hours.</p>';
  }
  var G = S.DONATION_GOAL;
  $$("[data-goal]").forEach(function (m) {
    if (!G) return;
    var p = Math.min(100, Math.round((G.raised / G.goal) * 100));
    m.innerHTML = '<div class="small mute" style="display:flex;justify-content:space-between;margin-bottom:6px"><span>' + G.label + "</span><span>$" + G.raised.toLocaleString() + " / $" + G.goal.toLocaleString() + '</span></div><div class="meter"><i style="width:' + Math.max(p, 2) + '%"></i></div>';
  });
  $$("[data-amt]").forEach(function (b) {
    b.addEventListener("click", function () { var i = $("#pledge-amount"); if (i) { i.value = b.getAttribute("data-amt"); i.focus(); } });
  });

  /* ---------- forms ---------- */
  function addr() {
    var r = window.__r || [], k = window.__k || "", s = "";
    for (var i = 0; i < r.length; i++) s += String.fromCharCode(r[i] ^ k.charCodeAt(i % k.length));
    return s;
  }
  function params() {
    var q = new URLSearchParams(location.search), o = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) { if (q.get(k)) o[k] = q.get(k); });
    return o;
  }
  var landing = store.get("567_landing") || location.href; store.set("567_landing", landing);
  var ref = store.get("567_ref") || document.referrer || "direct"; store.set("567_ref", ref);

  function validate(scope) {
    var ok = true, first = null;
    $$("input,select,textarea", scope).forEach(function (f) {
      if (f.closest(".hp")) return;
      f.classList.remove("err");
      var bad = false;
      if (f.required) {
        if (f.type === "checkbox") bad = !f.checked;
        else if (f.type === "radio") bad = !$$('input[name="' + f.name + '"]', scope).some(function (x) { return x.checked; });
        else bad = !f.value.trim();
      }
      if (!bad && f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value)) bad = true;
      if (!bad && f.type === "url" && f.value && !/^https?:\/\/.+\..+/.test(f.value)) bad = true;
      if (bad) { ok = false; f.classList.add("err"); if (!first) first = f; }
    });
    if (first) { first.focus(); toast("Please complete the highlighted fields."); }
    return ok;
  }

  function send(form) {
    var msg = $(".form-msg", form);
    if (!msg) { msg = document.createElement("div"); msg.className = "form-msg"; msg.setAttribute("aria-live", "polite"); form.appendChild(msg); }
    if (!validate(form)) return;
    var hp = $('input[name="_honey"]', form);
    if (hp && hp.value) return;
    var fd = new FormData(form), data = {};
    fd.forEach(function (v, k) { if (k === "_honey") return; data[k] = data[k] ? data[k] + ", " + v : v; });
    var kind = form.getAttribute("data-form") || "general";
    data._subject = "[567811] " + (form.getAttribute("data-subject") || kind) + (data.name ? " — " + data.name : "");
    data._template = "table"; data._captcha = "false";
    data.form_type = kind; data.page = location.href; data.landing = landing; data.referrer = ref;
    data.submitted = new Date().toISOString();
    var u = params(); Object.keys(u).forEach(function (k) { data[k] = u[k]; });
    var btn = $('button[type="submit"]', form); if (btn) { btn.disabled = true; btn._t = btn.textContent; btn.textContent = "Sending…"; }
    msg.className = "form-msg"; msg.textContent = "";
    fetch("https://formsubmit.co/ajax/" + addr(), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || res.j.success === "false" || res.j.success === false) throw new Error("fail");
        track("generate_lead", { form: kind });
        var done = form.getAttribute("data-done");
        if (done && $(done)) { form.style.display = "none"; $(done).style.display = "block"; $(done).scrollIntoView({ behavior: "smooth", block: "center" }); }
        else { msg.className = "form-msg ok"; msg.textContent = "✓ Received! We'll be in touch shortly."; form.reset(); }
        toast("Thanks — your submission was received.");
      })
      .catch(function () { msg.className = "form-msg bad"; msg.textContent = "Couldn't send right now. Please check your connection and try again in a minute."; })
      .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn._t; } });
  }
  $$("form[data-form]").forEach(function (f) {
    if (!$('input[name="_honey"]', f)) { var h = document.createElement("div"); h.className = "hp"; h.innerHTML = '<label>Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label>'; f.prepend(h); }
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (e) { e.preventDefault(); send(f); });
  });

  /* ---------- multi-step ---------- */
  $$("form[data-steps]").forEach(function (f) {
    var steps = $$(".fstep", f), bar = $(".progress i", f), lbl = $("[data-step-lbl]", f), cur = 0;
    function show(i) {
      steps.forEach(function (s, j) { s.classList.toggle("on", j === i); });
      cur = i; if (bar) bar.style.width = ((i + 1) / steps.length * 100) + "%";
      if (lbl) lbl.textContent = "Step " + (i + 1) + " of " + steps.length;
      var fs = $("input,select,textarea", steps[i]); if (fs && i > 0) setTimeout(function () { fs.focus({ preventScroll: true }); }, 50);
      track("lead_step", { step: i + 1 });
    }
    $$("[data-next]", f).forEach(function (b) { b.addEventListener("click", function () { if (validate(steps[cur])) show(Math.min(cur + 1, steps.length - 1)); }); });
    $$("[data-prev]", f).forEach(function (b) { b.addEventListener("click", function () { show(Math.max(cur - 1, 0)); }); });
    // prefill from query (?occasion=wedding&style=Bollywood&budget=...)
    var q = new URLSearchParams(location.search);
    q.forEach(function (v, k) {
      $$('[name="' + k + '"]', f).forEach(function (el) {
        if (el.type === "radio" || el.type === "checkbox") { if (el.value.toLowerCase() === v.toLowerCase()) el.checked = true; }
        else el.value = v;
      });
    });
    show(0);
  });

  /* ---------- lead modal ---------- */
  var modal = $("#lead-modal");
  function openM() { if (!modal) return; modal.classList.add("on"); var i = $("input:not([type=hidden])", modal); if (i) setTimeout(function () { i.focus(); }, 40); }
  function closeM() { if (modal) modal.classList.remove("on"); }
  $$("[data-open-lead]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openM(); }); });
  if (modal) {
    $$(".x", modal).forEach(function (x) { x.addEventListener("click", closeM); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeM(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeM(); });
    if (!document.body.hasAttribute("data-no-exit")) {
      var armed = false; setTimeout(function () { armed = true; }, 12000);
      document.addEventListener("mouseout", function (e) {
        if (!armed || e.relatedTarget || e.clientY > 8 || store.get("567_exit")) return;
        store.set("567_exit", "1"); openM(); track("exit_intent");
      });
    }
  }

  /* ---------- hero beat demo ---------- */
  var hb = $$("[data-hero-beats] .beat");
  if (hb.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var bi = 4;
    setInterval(function () { hb.forEach(function (b) { b.classList.remove("on"); }); hb[bi].classList.add("on"); bi = (bi + 1) % 8; }, 500);
  }
})();
