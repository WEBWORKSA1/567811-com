/* 567811 — interactive tools: metronome, choreo sheet, budget, quiz */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var T = window.toast567 || function () {};

  /* ================= COUNT-IN METRONOME ================= */
  var M = $("#metro");
  if (M) {
    var ctx = null, bpm = parseInt(ls.get("567_bpm"), 10) || 120, playing = false, beat = 0, nextT = 0, timer = null, ci = 0, queue = [];
    var bpmEl = $("#bpm", M), rng = $("#bpm-range", M), btn = $("#play", M), dots = $$(".beat", M);
    var optCI = $("#opt-countin", M), optVoice = $("#opt-voice", M), optSub = $("#opt-and", M), optAcc = $("#opt-accent", M);
    function setBpm(v) { bpm = Math.max(40, Math.min(220, Math.round(v))); bpmEl.textContent = bpm; rng.value = bpm; ls.set("567_bpm", bpm); }
    setBpm(bpm);
    rng.addEventListener("input", function () { setBpm(+rng.value); });
    $$("[data-bpm-step]", M).forEach(function (b) { b.addEventListener("click", function () { setBpm(bpm + +b.getAttribute("data-bpm-step")); }); });
    $$("[data-bpm-set]", M).forEach(function (b) { b.addEventListener("click", function () { setBpm(+b.getAttribute("data-bpm-set")); }); });
    function click(t, f, v, d) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.type = "square";
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (d || 0.05));
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + (d || 0.05) + 0.02);
    }
    function speak(n) {
      if (!optVoice.checked || !window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(String(n)); u.rate = Math.min(2, Math.max(1, bpm / 100)); u.volume = 1;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    }
    function schedule() {
      while (nextT < ctx.currentTime + 0.12) {
        var spb = 60 / bpm, label, countIn = ci > 0;
        if (countIn) { label = 9 - ci; ci--; click(nextT, 1320, 0.5, 0.07); }
        else {
          label = (beat % 8) + 1;
          var acc = optAcc.checked;
          if (label === 1) click(nextT, 1760, 0.6, 0.06);
          else if (label === 5 && acc) click(nextT, 1320, 0.45);
          else click(nextT, 880, 0.32);
          if (optSub.checked) click(nextT + spb / 2, 660, 0.12, 0.03);
          beat++;
        }
        queue.push({ t: nextT, n: label, ci: countIn });
        nextT += spb;
      }
    }
    function draw() {
      if (!playing) return;
      while (queue.length && queue[0].t <= ctx.currentTime) {
        var q = queue.shift();
        dots.forEach(function (d) { d.classList.remove("on", "ci"); });
        var d = dots[q.n - 1]; if (d) { d.classList.add("on"); if (q.ci) d.classList.add("ci"); }
        $("#metro-now", M).textContent = q.ci ? "Count-in: " + q.n + "…" : (q.n === 1 ? "ONE!" : q.n);
        if (q.ci || q.n === 1) speak(q.ci ? q.n : "one");
      }
      requestAnimationFrame(draw);
    }
    function start() {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      playing = true; beat = 0; queue = []; ci = optCI.checked ? 4 : 0; nextT = ctx.currentTime + 0.08;
      timer = setInterval(schedule, 25); schedule(); requestAnimationFrame(draw);
      btn.textContent = "■ Stop"; btn.setAttribute("aria-pressed", "true");
    }
    function stop() {
      playing = false; clearInterval(timer);
      dots.forEach(function (d) { d.classList.remove("on", "ci"); });
      $("#metro-now", M).textContent = "Ready";
      btn.textContent = "▶ Start"; btn.setAttribute("aria-pressed", "false");
    }
    btn.addEventListener("click", function () { playing ? stop() : start(); });
    var taps = [];
    function tap() {
      var n = performance.now(); if (taps.length && n - taps[taps.length - 1] > 2000) taps = [];
      taps.push(n); if (taps.length > 8) taps.shift();
      if (taps.length > 1) { var s = 0; for (var i = 1; i < taps.length; i++) s += taps[i] - taps[i - 1]; setBpm(60000 / (s / (taps.length - 1))); }
      $("#tap", M).textContent = "Tap (" + taps.length + ")";
    }
    $("#tap", M).addEventListener("click", tap);
    document.addEventListener("keydown", function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.code === "Space") { e.preventDefault(); playing ? stop() : start(); }
      else if (e.key === "t" || e.key === "T") tap();
      else if (e.key === "ArrowUp") { e.preventDefault(); setBpm(bpm + 1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setBpm(bpm - 1); }
    });
  }

  /* ================= 8-COUNT CHOREO SHEET ================= */
  var SH = $("#sheet");
  if (SH) {
    var KEY = "567_sheet_v1", body = $("tbody", SH);
    var data = null; try { data = JSON.parse(ls.get(KEY) || "null"); } catch (e) {}
    data = data || { title: "", song: "", bpm: "", phrases: [new Array(8).fill(0).map(function () { return ["", ""]; })] };
    $("#sh-title").value = data.title; $("#sh-song").value = data.song; $("#sh-bpm").value = data.bpm;
    function render() {
      var h = "";
      data.phrases.forEach(function (p, pi) {
        h += '<tr><th colspan="3" style="text-align:left;background:var(--bg2)">8-count #' + (pi + 1) + ' <button type="button" class="btn sm ghost no-print" data-del="' + pi + '" style="float:right;padding:3px 10px">Remove</button></th></tr>';
        p.forEach(function (c, ci) {
          h += "<tr><th>" + (ci + 1) + '</th><td><input aria-label="Move, phrase ' + (pi + 1) + " count " + (ci + 1) + '" data-p="' + pi + '" data-c="' + ci + '" data-i="0" value="' + c[0].replace(/"/g, "&quot;") + '" placeholder="' + (ci === 0 ? "e.g. step R, arms up" : "") + '"></td><td><input aria-label="Notes" data-p="' + pi + '" data-c="' + ci + '" data-i="1" value="' + c[1].replace(/"/g, "&quot;") + '" placeholder="' + (ci === 0 ? "formation / facing / cue" : "") + '"></td></tr>';
        });
      });
      body.innerHTML = h;
      $("#sh-count").textContent = data.phrases.length + " × 8 counts";
    }
    function save() { data.title = $("#sh-title").value; data.song = $("#sh-song").value; data.bpm = $("#sh-bpm").value; ls.set(KEY, JSON.stringify(data)); }
    body.addEventListener("input", function (e) { var t = e.target; if (t.dataset.p) { data.phrases[t.dataset.p][t.dataset.c][t.dataset.i] = t.value; save(); } });
    body.addEventListener("click", function (e) { var d = e.target.getAttribute("data-del"); if (d !== null && data.phrases.length > 1) { data.phrases.splice(+d, 1); save(); render(); } });
    ["#sh-title", "#sh-song", "#sh-bpm"].forEach(function (s) { $(s).addEventListener("input", save); });
    $("#sh-add").addEventListener("click", function () { data.phrases.push(new Array(8).fill(0).map(function () { return ["", ""]; })); save(); render(); });
    $("#sh-print").addEventListener("click", function () { window.print(); });
    $("#sh-clear").addEventListener("click", function () { if (confirm("Clear the whole sheet?")) { data = { title: "", song: "", bpm: "", phrases: [new Array(8).fill(0).map(function () { return ["", ""]; })] }; ["#sh-title", "#sh-song", "#sh-bpm"].forEach(function (s) { $(s).value = ""; }); save(); render(); } });
    $("#sh-copy").addEventListener("click", function () {
      var t = (data.title || "Untitled routine") + (data.song ? " — " + data.song : "") + (data.bpm ? " @ " + data.bpm + " BPM" : "") + "\n";
      data.phrases.forEach(function (p, i) { t += "\n8-count #" + (i + 1) + "\n"; p.forEach(function (c, j) { if (c[0] || c[1]) t += "  " + (j + 1) + ": " + c[0] + (c[1] ? "  [" + c[1] + "]" : "") + "\n"; }); });
      t += "\nMade with 567811 · Count In. Dance On.";
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { T("Copied to clipboard."); }, function () { prompt("Copy your sheet:", t); });
    });
    render();
  }

  /* ================= DANCE BUDGET ESTIMATOR ================= */
  var B = $("#budget");
  if (B) {
    // Indicative ranges per region: [sessionLow, sessionHigh, routineLow, routineHigh, dayOfLow, dayOfHigh]
    var R = {
      "India — metro": { c: "₹", r: [2500, 6000, 8000, 25000, 5000, 15000] },
      "India — tier 2/3": { c: "₹", r: [1500, 4000, 5000, 15000, 3000, 8000] },
      "United States": { c: "$", r: [75, 150, 300, 900, 250, 600] },
      "Canada": { c: "C$", r: [80, 150, 300, 900, 250, 600] },
      "United Kingdom": { c: "£", r: [55, 110, 250, 700, 200, 450] },
      "UAE / Gulf": { c: "AED ", r: [250, 550, 1200, 3500, 800, 2000] },
      "Australia": { c: "A$", r: [80, 160, 350, 950, 250, 600] }
    };
    var MULT = { "Sangeet / family performances": 1, "Couple first dance": 0.8, "Corporate / flash mob": 1.3, "Private lessons only": 0 };
    function fmt(c, n) { return c + (Math.round(Math.max(0, n) / 50) * 50).toLocaleString(); }
    function calc() {
      var reg = R[$("#b-region").value], type = $("#b-type").value, rt = +$("#b-routines").value || 0, dn = +$("#b-dancers").value || 1, ss = +$("#b-sessions").value || 0, day = $("#b-dayof").checked;
      var g = dn > 15 ? 1.4 : dn > 8 ? 1.2 : dn > 3 ? 1.08 : 1, m = MULT[type];
      var lo = ss * reg.r[0] * (g > 1 ? 1 + (g - 1) / 2 : 1) + rt * reg.r[2] * g * m + (day ? reg.r[4] : 0);
      var hi = ss * reg.r[1] * (g > 1 ? 1 + (g - 1) / 2 : 1) + rt * reg.r[3] * g * m + (day ? reg.r[5] : 0);
      $("#b-out").innerHTML = '<span class="eyebrow">Indicative range</span><div class="bpm" style="font-size:clamp(2rem,6vw,3.2rem)">' + fmt(reg.c, lo) + " – " + fmt(reg.c, hi) + '</div><p class="mute small">Based on ' + ss + " rehearsal session(s), " + rt + " routine(s), " + dn + " dancer(s)" + (day ? ", day-of support" : "") + ". Typical market ranges, not a quote — real prices vary by choreographer, city and season.</p>";
      var q = new URLSearchParams({ occasion: type.indexOf("Corporate") > -1 ? "Corporate / flash mob" : type.indexOf("first") > -1 ? "Wedding first dance" : type.indexOf("Private") > -1 ? "Private lessons" : "Sangeet / wedding performances", group: String(dn), budget: fmt(reg.c, lo) + " – " + fmt(reg.c, hi), region: $("#b-region").value });
      $("#b-cta").href = $("#b-cta").getAttribute("data-base") + "?" + q.toString();
    }
    $$("input,select", B).forEach(function (e) { e.addEventListener("input", calc); e.addEventListener("change", calc); });
    calc();
  }

  /* ================= STYLE QUIZ ================= */
  var Q = $("#quiz");
  if (Q) {
    var STY = {
      "Hip Hop": "Groove-driven street style — bounces, rocks and attitude.",
      "Bollywood": "Expressive, theatrical, joyful — perfect for sangeets and parties.",
      "Contemporary": "Fluid, emotional, floor-work and storytelling.",
      "Ballet": "Technique, posture and control — the foundation of many styles.",
      "Jazz": "Sharp, showy, high-energy — kicks, turns and leaps.",
      "Salsa": "Partner social dance with quick footwork and spins.",
      "Bachata": "Smooth, sensual partner dance — easy to start socially.",
      "K-Pop": "Tight, synchronised choreography from your favourite videos.",
      "Ballroom": "Elegant partner frames — waltz, foxtrot, wedding first dances.",
      "Bhangra": "Explosive, celebratory Punjabi folk energy.",
      "Dance Fitness": "Cardio-first, no-experience-needed, 11-minute sweat sessions."
    };
    var QS = [
      ["Why do you want to dance?", [["Get fit & sweat", { "Dance Fitness": 3, "Bhangra": 1, "Hip Hop": 1 }], ["Perform at a wedding/event", { "Bollywood": 3, "Ballroom": 2, "Bhangra": 2 }], ["Express emotion", { "Contemporary": 3, "Ballet": 1, "Jazz": 1 }], ["Learn viral choreo", { "K-Pop": 3, "Hip Hop": 2 }]]],
      ["Solo or with a partner?", [["Solo", { "Hip Hop": 1, "Contemporary": 1, "K-Pop": 1, "Jazz": 1 }], ["With a partner", { "Salsa": 3, "Bachata": 3, "Ballroom": 3 }], ["In a group", { "Bollywood": 2, "Bhangra": 2, "K-Pop": 2 }], ["No preference", { "Dance Fitness": 1 }]]],
      ["Pick a music vibe", [["Hip hop / R&B", { "Hip Hop": 3 }], ["Bollywood / Punjabi", { "Bollywood": 2, "Bhangra": 3 }], ["Latin", { "Salsa": 3, "Bachata": 3 }], ["Pop / K-pop / classical", { "K-Pop": 2, "Ballet": 2, "Jazz": 1, "Ballroom": 1 }]]],
      ["Your energy level?", [["Chill & smooth", { "Bachata": 2, "Contemporary": 1, "Ballroom": 2 }], ["Balanced", { "Salsa": 1, "Bollywood": 1, "Jazz": 1 }], ["High energy", { "Bhangra": 2, "Hip Hop": 1, "Dance Fitness": 2, "Jazz": 1 }], ["Precise & controlled", { "Ballet": 3, "K-Pop": 1 }]]],
      ["Experience?", [["Brand new", { "Dance Fitness": 2, "Bachata": 1, "Bollywood": 1 }], ["A little", { "Hip Hop": 1, "Salsa": 1, "K-Pop": 1 }], ["Some training", { "Jazz": 1, "Contemporary": 1 }], ["Trained dancer", { "Ballet": 1, "Contemporary": 2 }]]],
      ["How much time weekly?", [["11 minutes a day", { "Dance Fitness": 2, "K-Pop": 1 }], ["1–2 hours", { "Hip Hop": 1, "Bollywood": 1, "Salsa": 1 }], ["3–5 hours", { "Jazz": 1, "Contemporary": 1, "Ballroom": 1 }], ["As much as possible", { "Ballet": 2, "Hip Hop": 1 }]]]
    ];
    var qi = 0, score = {};
    Object.keys(STY).forEach(function (k) { score[k] = 0; });
    function showQ() {
      if (qi >= QS.length) return result();
      var q = QS[qi], h = '<div class="progress"><i style="width:' + ((qi + 1) / QS.length * 100) + '%"></i></div><p class="small mute">Question ' + (qi + 1) + " of " + QS.length + "</p><h2>" + q[0] + '</h2><div class="opts" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">';
      q[1].forEach(function (o, i) { h += '<button type="button" class="btn ghost" data-o="' + i + '" style="border-radius:14px;padding:18px">' + o[0] + "</button>"; });
      Q.innerHTML = h + "</div>";
      $$("[data-o]", Q).forEach(function (b) { b.addEventListener("click", function () { var w = q[1][+b.getAttribute("data-o")][1]; Object.keys(w).forEach(function (k) { score[k] += w[k]; }); qi++; showQ(); }); });
    }
    function result() {
      var top = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }), w = top[0], base = Q.getAttribute("data-root") || "";
      Q.innerHTML = '<div class="result"><span class="eyebrow">Your style</span><h2 class="grad" style="font-size:clamp(2.2rem,6vw,3.4rem)">' + w + "</h2><p>" + STY[w] + '</p><p class="small mute">Runners-up: ' + top[1] + " · " + top[2] + '</p><div class="cta-row"><a class="btn" href="' + base + "get-matched.html?style=" + encodeURIComponent(w) + '">Find a ' + w + ' teacher near me</a><a class="btn ghost" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(w + " dance tutorial beginner") + '">Watch ' + w + ' tutorials</a><button class="btn ghost" type="button" id="q-re">Retake</button></div></div>';
      $("#q-re").addEventListener("click", function () { qi = 0; Object.keys(score).forEach(function (k) { score[k] = 0; }); showQ(); });
      if (window.gtag) gtag("event", "quiz_result", { style: w });
    }
    showQ();
  }
})();
