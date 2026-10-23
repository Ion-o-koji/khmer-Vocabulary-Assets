    (function() {
      var _app = document.getElementById('app');
      if (_app) _app.innerHTML = `
<div id="fs-overlay" onclick="enterFsFromOverlay()">
  <div class="fso-icon">⛶</div>
  <div class="fso-title">Tap to Enter Full Screen</div>
  <div class="fso-sub">This app is set to open in full screen</div>
  <div class="fso-btn">&#9654; Enter Full Screen</div>
</div>


  <header>
    <h1>Kh Vocab</h1>
    <span class="user-badge" id="ubadge" onclick="openAccountQuick()" style="display:none"></span>
    <div class="spill" id="spill" onclick="onSpillClick()">
      <span class="dot" id="dot"></span>
      <span class="spill-txt" id="stxt">Loading…</span>
    </div>
    <button class="ibtn" id="sync-btn" onclick="doSyncClick()" title="Sync now"><span class="rib">↻</span></button>
    <button class="ibtn" onclick="openCfg()" title="Settings">⚙️</button>
  </header>


  <div class="ro-banner" id="ro-banner">
    <span>👁 Viewing <strong id="ro-banner-name"></strong> — read-only</span>
    <button class="ro-return-btn" onclick="returnToMyAccount()">Return to my account</button>
  </div>


  <nav class="nav">
    <button id="nav-view" onclick="goPage('view','nav-view')">📋 View</button>
    <button id="nav-add" onclick="goPage('add','nav-add')" class="write-only">➕ Add</button>
    <button id="nav-trans" onclick="goPage('trans','nav-trans')">🔤 Translate</button>
    <button id="nav-study" onclick="goPage('study','nav-study');setTimeout(initStudyPage,0)">🎴 Study</button>
    <button id="nav-progress" onclick="goPage('progress','nav-progress');setTimeout(renderProgress,0)">📊 Progress</button>
    <button id="nav-ref" onclick="goPage('ref','nav-ref')">📚 Ref</button>
    <button id="nav-dash" onclick="goPage('dash','nav-dash');setTimeout(function(){loadDashboard(false)},0)">🌐 Dash</button>
    <button id="nav-notebook" onclick="goPage('notebook','nav-notebook')">📓 Notebook</button>
  </nav>


  <div id="page-view" class="page">
    <div class="srow">
      <div class="srch-wrap"><input type="text" id="q" placeholder="🔍 Search…" oninput="_srchClear('q','q-clr');render()" autocomplete="off" /><button class="srch-clear" id="q-clr" onclick="el('q').value='';_srchClear('q','q-clr');el('q').focus();render()" title="Clear">×</button></div>
      <button class="bbtn" id="btn-sel" onclick="toggleBulk()">✓ Select</button>
    </div>
    <div class="sort-row">
      <select class="sort-cat-sel view-cat-sel" id="view-cat-filter" onchange="lsSet('kv_view_cat',this.value);render()"></select>
      <button type="button" class="add-cat-btn add-cat-btn-wide" onclick="openNewCatModal()" title="Add / edit categories">＋ Edit</button>
      <button class="bbtn" id="btn-kh" onclick="toggleBlur('kh')">🙈 KH</button>
      <button class="bbtn" id="btn-en" onclick="toggleBlur('en')">🙈 EN</button>
      <button class="sort-chip active" id="sc-date" onclick="setQuickSort('date')">🕐 Newest</button>
      <button class="sort-chip" id="sc-conf" onclick="toggleConfSort()" title="Sort by confidence level">🔴 Weakest</button>
      <select class="sort-cat-sel" id="view-conf-filter" onchange="lsSet('kv_view_conf',this.value);render()" title="Confidence level filter">
        <option value="all">All Levels</option>
        <option value="weak">🔴 Weak (Unknown + Unstudied)</option>
        <option value="got">✅ Got It only</option>
        <option value="kinda">🤔 Kind Of only</option>
        <option value="unknown">❌ Unknown only</option>
        <option value="unstudied">📖 Unstudied only</option>
      </select>

      <button class="bbtn" id="btn-copy-kh" onclick="copyKhColumn()" title="Copy the Khmer column to the clipboard">📋 Copy KH</button>
    </div>
    <div class="twrap">
      <table id="tbl">
        <thead>
          <tr>
            <th class="col-sel nosort"><input type="checkbox" id="sel-all" onchange="selectAll(this.checked)" style="accent-color:var(--acc2)"></th>
            <th class="col-en" onclick="clickSort(0)">English</th>
            <th class="col-kh" onclick="clickSort(1)">Khmer</th>
            <th class="col-ro" onclick="clickSort(2)">Romanization</th>
            <th class="col-no" onclick="clickSort(3)">Notes</th>
            <th class="col-ca" onclick="clickSort(4)">Category</th>
            <th class="col-dt nosort">Date Added</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>
      <div id="empty" class="empty-st" style="display:none">
        <div class="ico">📭</div>
        <p id="empty-msg">No entries yet.</p>
      </div>
    </div>
  </div>


  <div id="page-add" class="page">
    <div class="form-wrap">
      <h2>Add New Entry</h2>
      <p class="sub">Entries sync to your sheet tab in the background — safe to add more right away.</p>
      <div class="form-card">
        <form id="add-form" onsubmit="submitAdd(event)">
          <div class="pair-row">
            <div class="fg">
              <label>English</label>
              <input id="f-en" type="text" placeholder="country" autocomplete="off" />
            </div>
            <div class="fg">
              <label>Khmer <span class="hint">ភាសាខ្មែរ</span></label>
              <input id="f-kh" class="khi kh" type="text" placeholder="ស្រុក" autocomplete="off" />
            </div>
          </div>
          <div class="fg"><label>Romanization</label><input id="f-ro" type="text" placeholder="srok" autocomplete="off" /></div>
          <div class="fg"><label>Notes</label><textarea id="f-no" placeholder="Context, memory tips…"></textarea></div>
          <div class="fg"><label>Category</label><div style="display:flex;gap:6px;align-items:center"><select id="f-cat" style="flex:1"></select><button type="button" class="add-cat-btn" onclick="openNewCatModal()" title="Add/edit categories">+</button></div></div>
          <button type="submit" class="prim-btn" id="add-btn">
            <span id="add-lbl">✈️ Send to Sheet</span><span class="spin" id="add-spin"></span>
          </button>
          <div class="add-sent-notice" id="add-notice"></div>
        </form>
      </div>
    </div>
  </div>


  <div id="page-trans" class="page">
    <div class="trans-wrap">
      <div class="trans-sticky-header">
        <div class="trans-search-bar" style="position:relative">
          <input class="trans-search-input" id="dict-input" type="text" placeholder="Type English or ភាសាខ្មែរ…" autocomplete="off" autocorrect="off" spellcheck="false" />
          <button class="trans-clear-btn" id="dict-clear" title="Clear">✕</button>
          <button class="trans-search-btn" id="dict-search-btn">Search</button>
        </div>
        <div class="th-tray" id="th-tray"></div>
      </div>
      <div class="trans-content" id="dict-content">
        <div class="trans-landing">
          <div class="tl-icon">🇰🇭 ⇆ 🇬🇧</div>
          <h3>Khmer ⇆ English Translator</h3>
          <p>Checks Google, MyMemory, Lingva, Wiktionary and your own deck at the same time.<br>Numbers are converted automatically.</p>
        </div>
      </div>
    </div>
  </div>


  <div id="page-study" class="page">
    <div class="study-wrap">
      <div class="study-method-label" style="margin-bottom:10px">🎴 Flashcard</div>
      <details class="fc-set-acc" id="fc-set-acc">
        <summary class="fc-set-head"><span>⚙️ Flashcard Settings</span><span class="fc-set-chev" aria-hidden="true">▾</span></summary>
        <div class="fc-set-body">
          <div class="fc-set-group"><div class="fc-set-gtitle">Display</div>
            <label class="fc-set-row" for="opt-studyro"><span class="fc-set-txt"><span class="fc-set-name">Romanized</span><span class="fc-set-sub">Show romanization after flipping</span></span><span class="tog"><input type="checkbox" id="opt-studyro" checked onchange="saveSettings()"><span class="tog-sl"></span></span></label>
            <label class="fc-set-row" for="opt-hideduetoday"><span class="fc-set-txt"><span class="fc-set-name">Hide Due Today Words</span><span class="fc-set-sub">Hide the 📅 Due Today banner at the top</span></span><span class="tog"><input type="checkbox" id="opt-hideduetoday" onchange="saveSettings();applyStudyPrefs()"><span class="tog-sl"></span></span></label>
          </div>
          <div class="fc-set-group"><div class="fc-set-gtitle">Card Flow</div>
            <label class="fc-set-row" for="opt-srs"><span class="fc-set-txt"><span class="fc-set-name">Spaced repetition</span><span class="fc-set-sub">Schedule reviews with SRS</span></span><span class="tog"><input type="checkbox" id="opt-srs" checked onchange="saveSettings()"><span class="tog-sl"></span></span></label>
            <label class="fc-set-row" for="opt-mc"><span class="fc-set-txt"><span class="fc-set-name">Multiple choice</span><span class="fc-set-sub">Quiz mode with 4 answers</span></span><span class="tog"><input type="checkbox" id="opt-mc" onchange="saveSettings()"><span class="tog-sl"></span></span></label>
            <label class="fc-set-row" for="opt-match5"><span class="fc-set-txt"><span class="fc-set-name">Match 5</span><span class="fc-set-sub">Review weak words in 5-card batches</span></span><span class="tog"><input type="checkbox" id="opt-match5" onchange="saveSettings()"><span class="tog-sl"></span></span></label>
            <label class="fc-set-row" for="opt-favboost"><span class="fc-set-txt"><span class="fc-set-name">⭐ Favourite boost</span><span class="fc-set-sub">Favourited words show up more often</span></span><span class="tog"><input type="checkbox" id="opt-favboost" onchange="saveSettings();initStudy()"><span class="tog-sl"></span></span></label>
            <label class="fc-set-row" for="opt-swipe"><span class="fc-set-txt"><span class="fc-set-name">Swipe cards</span><span class="fc-set-sub">Before flip: next / previous. After flip: Don’t know / Know</span></span><span class="tog"><input type="checkbox" id="opt-swipe" onchange="saveSettings();applyStudyPrefs()"><span class="tog-sl"></span></span></label>
          </div>
          <div class="fc-set-group"><div class="fc-set-gtitle">Audio / Timing</div>
            <label class="fc-set-row" for="opt-autospeak"><span class="fc-set-txt"><span class="fc-set-name">Speak on flip</span><span class="fc-set-sub">Play the Khmer audio when a card is flipped</span></span><span class="tog"><input type="checkbox" id="opt-autospeak" checked onchange="saveSettings()"><span class="tog-sl"></span></span></label>
          </div>
        </div>
      </details>
      <button type="button" class="due-today-btn" id="due-today-btn" onclick="studyDueToday()">📅 Due Today (0)</button>
      <div class="study-controls">
        <div class="study-ctrl-row">
          <select id="study-filter" class="study-cat-sel active-sel study-multi-sel" multiple size="4" onchange="onStudyCatChange('user');initStudy()" title="Pick one or more categories"></select>
          <select id="study-preset-filter" class="study-cat-sel study-preset-compact" onchange="onStudyCatChange('preset');initStudy()"></select>
        </div>
        <div class="study-ctrl-row">
          <select id="study-conf-filter" onchange="initStudy()" style="min-width:110px">
            <option value="all">All Levels</option>
            <option value="weak">&#x1F534; Weak (Unknown+)</option>
            <option value="got">✅ Got It only</option>
            <option value="kinda">🤔 Kind Of only</option>
            <option value="unknown">❌ Unknown only</option>
            <option value="unstudied">📖 Unstudied only</option>
          </select>
          <select id="study-order" onchange="initStudy()" title="Deck order" style="min-width:120px">
            <option value="shuffle">🔀 Shuffled</option>
            <option value="weak">🔴 Weakest first</option>
            <option value="strong">🟢 Strongest first</option>
          </select>
          <button class="study-dir-btn" id="study-dir-btn" onclick="toggleStudyDir()">Khmer → English</button>
          <div class="study-len-inp-wrap" title="Number of cards to study">
            <label for="study-len">Cards:</label>
            <input type="number" id="study-len" class="study-len-inp" min="1" max="999" value="20" placeholder="20" onchange="initStudy()" />
          </div>
        </div>
      </div>
      <div class="fc-stage" id="fc-stage">
      <div class="study-prog-row">
        <div class="study-prog-bar">
          <div class="study-prog-fill" id="spf" style="width:0%"></div>
        </div>
        <div class="study-prog-txt" id="study-prog">0 / 0</div>
      </div>
      <div class="flashcard" id="flashcard" onclick="flipCard()">
        <div class="fc-badge" id="fc-badge"></div>
        <button class="fc-edit-btn" id="fc-edit-btn" onclick="editCurrentCard(event)" title="Edit word">✏️</button>
        <button class="fc-star-btn mirrored-bl" id="fc-star-btn" onclick="toggleCardFav(event)" title="Add to favourites">☆</button>
        <div class="fc-swipe-ind fc-swipe-r" id="fc-swipe-r" aria-hidden="true">✓ Know</div>
        <div class="fc-swipe-ind fc-swipe-l" id="fc-swipe-l" aria-hidden="true">✗ Don't Know</div>
        <button class="fc-fs-btn" id="fc-fs-btn" onclick="toggleCardFullscreen(event)" title="Full screen flashcards">⛶</button>
        <div class="fc-conf-badge" id="fc-conf-badge" style="display:none"></div>
        <div id="fc-content">
          <div class="fc-hint">Tap to start</div>
        </div>
      </div>
      <button class="fc-speak-btn" id="fc-speak-btn" onclick="speakCurrentCard()" style="display:none">🔊 Hear Word</button>
      <div class="conf-btns" id="conf-btns" style="display:none">
        <button class="conf-btn cb-u" onclick="rateCard(0)">✗ Didn't know</button>
        <button class="conf-btn cb-m" onclick="rateCard(1)">~ Kind of</button>
        <button class="conf-btn cb-k" onclick="rateCard(2)">✓ Got it</button>
      </div>
      <div class="study-nav" id="study-nav">
        <button class="s-prev" onclick="prevCard()">← Prev</button>
        <button class="s-next" onclick="nextCard()">Next →</button>
      </div>
      <div class="match-panel" id="match-panel" style="display:none">
        <div class="match-head">🧩 Quick Match — pair the last 5 cards</div>
        <div class="match-grid">
          <div class="match-col" id="match-col-kh"></div>
          <div class="match-col" id="match-col-en"></div>
        </div>
        <div class="match-status" id="match-status"></div>
        <button class="bbtn" id="match-skip" onclick="finishMatch(true)">Skip →</button>
      </div>
      </div>
      <div class="session-summary" id="session-summary" style="display:none">
        <h3>Session Complete 🎉</h3>
        <div class="ss-stats">
          <div class="ss-item ss-k">
            <div class="ss-num" id="ss-k">0</div>
            <div class="ss-lbl">Got it</div>
          </div>
          <div class="ss-item ss-m">
            <div class="ss-num" id="ss-m">0</div>
            <div class="ss-lbl">Kind of</div>
          </div>
          <div class="ss-item ss-u">
            <div class="ss-num" id="ss-u">0</div>
            <div class="ss-lbl">Didn't know</div>
          </div>
        </div>
        <div class="ss-btns">
          <button class="prim-btn" onclick="studyWeak()" id="ss-weak-btn" style="margin-top:0;font-size:.88rem;height:44px">🔴 Study weak words again</button>
          <button class="prim-btn" onclick="initStudy()" style="margin-top:0;font-size:.88rem;height:44px;background:linear-gradient(135deg,#1d4ed8,#3b82f6)">🔀 New session</button>
          <button class="ss-exit-fs" id="ss-exit-fs" type="button" onclick="exitAnyFullscreen(event)" style="display:none">✕ Exit Full Screen</button>
        </div>
      </div>
      <div class="empty-st" id="study-empty" style="display:none">
        <div class="ico">📭</div>
        <p>No cards to study. Add some words first!</p>
      </div>


      <hr class="study-divider">
      <div class="study-method-block">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div class="study-method-label" style="margin-bottom:0" id="write-head">✍️ Writing &amp; Spelling</div>
          <button class="bbtn" style="padding:3px 9px;font-size:.72rem;height:26px;border-radius:7px;line-height:1" onclick="startWriting()" title="Reshuffle cards">🔀</button>
        </div>
        <div class="study-sub-desc" id="write-desc">See the English word — type the Khmer from memory.</div>
        <div class="write-prompt" id="write-prompt">Loading…</div>
        <div class="write-progress" id="write-progress"></div>
        <button class="prim-btn" id="write-speak-btn" onclick="speakWriteCard()" style="width:100%;font-size:.85rem;height:42px;margin-bottom:10px;display:none">&#x1F50A; Tap to Hear</button>
        <input class="write-input" id="write-input" type="text" placeholder="Type here…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" onkeydown="if(event.key==='Enter')checkWriting()">
        <div class="write-result" id="write-result" style="display:none"></div>
        <div class="study-action-row">
          <div style="flex:1;display:flex;gap:5px">
            <button class="study-skip-btn" style="flex:1;font-size:.76rem" onclick="prevWriting()">← Prev</button>
            <button class="study-skip-btn" style="flex:1;font-size:.76rem" onclick="skipWriting()">Next →</button>
          </div>
          <button class="study-check-btn" id="write-check-btn" onclick="checkWriting()">✓ Check</button>
        </div>
      </div>


      <hr class="study-divider">
      <div class="study-method-block">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div class="study-method-label" style="margin-bottom:0" id="listen-head">🔊 Listening</div>
          <button class="bbtn" style="padding:3px 9px;font-size:.72rem;height:26px;border-radius:7px;line-height:1" onclick="startListening()" title="Reshuffle cards">🔀</button>
        </div>
        <div class="study-sub-desc" id="listen-desc">Hear the Khmer word — type the Khmer spelling.</div>
        <div class="write-prompt" id="listen-prompt">Loading…</div>
        <div class="write-progress" id="listen-progress"></div>
        <button class="prim-btn" id="listen-play-btn" onclick="playCurrentListenCard()" style="width:100%;font-size:.85rem;height:42px;margin-bottom:10px;display:none">🔊 Tap to Hear</button>
        <input class="write-input" id="listen-input" type="text" placeholder="Type here…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" onkeydown="if(event.key==='Enter')checkListening()">
        <div class="write-result" id="listen-result" style="display:none"></div>
        <div class="study-action-row">
          <div style="flex:1;display:flex;gap:5px">
            <button class="study-skip-btn" style="flex:1;font-size:.76rem" onclick="prevListening()">← Prev</button>
            <button class="study-skip-btn" style="flex:1;font-size:.76rem" onclick="skipListening()">Next →</button>
          </div>
          <button class="study-check-btn" id="listen-check-btn" onclick="checkListening()">✓ Check</button>
        </div>
      </div>
    </div>
  </div>


  <div id="page-progress" class="page">
    <div class="pg-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h2 style="margin-bottom:0">📊 Progress &amp; Milestones</h2>
        <button class="bbtn" id="daily-report-btn" onclick="openDailyReportModal()" style="font-size:0.75rem;padding:4px 10px">📅 Daily Report</button>
      </div>
      <div id="pg-stats-note" style="display:none;font-size:.72rem;color:var(--dim);margin-bottom:8px;text-align:center;padding:4px 0"></div>
      <div class="stat-cards">
        <div class="stat-card">
          <div class="sc-val" id="pg-total"><span class="stat-skeleton"></span></div>
          <div class="sc-lbl">Total Words</div>
        </div>
        <div class="stat-card">
          <div class="sc-val" id="pg-fav">0</div>
          <div class="sc-lbl">Favourites ⭐</div>
        </div>
        <div class="stat-card">
          <div class="sc-val" id="pg-mastered">0</div>
          <div class="sc-lbl">Mastered ✓</div>
        </div>
        <div class="stat-card">
          <div class="sc-val" id="pg-studied">0</div>
          <div class="sc-lbl">Words Studied</div>
        </div>
        <div class="stat-card">
          <div class="sc-val" id="pg-streak"><span class="stat-skeleton"></span></div>
          <div class="sc-lbl">🔥 Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="sc-val" id="pg-best-streak">0</div>
          <div class="sc-lbl">🏆 Best Streak</div>
        </div>
      </div>
      <div class="section-card">
        <h3>Confidence Breakdown <span style="font-size:.68rem;color:var(--dim);font-weight:400">— tap to study</span></h3>
        <div class="conf-bars">
          <div class="conf-item" style="cursor:pointer" title="Study words you Got It" onclick="openConfStudy(2)">
            <div class="conf-val cv-k" id="pg-knew">0</div>
            <div class="conf-lbl">Got it</div>
            <div style="font-size:.58rem;color:var(--dim);margin-top:2px">▶ Study</div>
          </div>
          <div class="conf-item" style="cursor:pointer" title="Study words you Kinda Know" onclick="openConfStudy(1)">
            <div class="conf-val cv-m" id="pg-kinda">0</div>
            <div class="conf-lbl">Kinda</div>
            <div style="font-size:.58rem;color:var(--dim);margin-top:2px">▶ Study</div>
          </div>
          <div class="conf-item" style="cursor:pointer" title="Study words marked Unknown" onclick="openConfStudy(0)">
            <div class="conf-val cv-u" id="pg-unkn">0</div>
            <div class="conf-lbl">Unknown</div>
            <div style="font-size:.58rem;color:var(--dim);margin-top:2px">▶ Study</div>
          </div>
          <div class="conf-item" style="cursor:pointer" title="Study words not yet studied" onclick="openConfStudy(-1)">
            <div class="conf-val cv-n" id="pg-unstudied">0</div>
            <div class="conf-lbl">Unstudied</div>
            <div style="font-size:.58rem;color:var(--dim);margin-top:2px">▶ Study</div>
          </div>
        </div>
      </div>
      <div class="section-card">
        <h3>By Category</h3>
        <div id="pg-cat-bars"></div>
      </div>
      <div class="section-card">
        <h3>Activity Heatmap (Last 28 Days)</h3>
        <div class="heatmap" id="heatmap"></div>
      </div>
      <div class="section-card">
        <h3>🏆 Achievements</h3>
        <div style="font-size:.72rem;color:var(--dim);margin-bottom:10px">Tap a card for a hint — or to see what you did to unlock it.</div>
        <div class="milestone-shelf" id="achv-shelf"></div>
      </div>
      <div class="section-card">
        <div class="ms-shelf-title">Words Added</div>
        <div class="milestone-shelf" id="milestone-shelf-add"></div>
        <div class="ms-shelf-title">Words Studied</div>
        <div class="milestone-shelf" id="milestone-shelf-study"></div>
        <div class="ms-shelf-title">Words Mastered</div>
        <div class="milestone-shelf" id="milestone-shelf-master"></div>
        <div class="ms-shelf-title">Study Streak</div>
        <div class="milestone-shelf" id="milestone-shelf-streak"></div>
      </div>
    </div>
  </div>


  <div id="page-ref" class="page">
    <div class="ref-wrap">
      <h2>📚 Khmer Reference</h2>
      <div class="ref-section">
        <h3>Sing Khmer (Shorthand)</h3>
        <div class="srch-wrap"><input type="text" id="sk-search" placeholder="🔍 Search English or shorthand… (e.g. &quot;ot mean&quot;)" oninput="_srchClear('sk-search','sk-search-clr');renderSingKhmer()" autocomplete="off" /><button class="srch-clear" id="sk-search-clr" onclick="el('sk-search').value='';_srchClear('sk-search','sk-search-clr');el('sk-search').focus();renderSingKhmer()" title="Clear">×</button></div>
        <div id="sk-translate-note"></div>
        <div class="ref-sk-scroll" id="ref-sing-khmer"></div>
        <div class="ref-note">Sing Khmer is a personal romanized shorthand, not standard Khmer script. (Thanks to Elder Eav for the words!)</div>
      </div>
      <div class="ref-section">
        <h3>All Consonants (33)</h3>
        <div class="ref-grid-5" id="ref-all-cons"></div>
        <div class="ref-note">S1 = Series 1 (inherent vowel "a") · S2 = Series 2 (inherent vowel "o")</div>
      </div>
      <div class="ref-section">
        <h3>Dependent Vowels</h3>
        <table class="vowel-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>S1 sound</th>
              <th>S2 sound</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody id="ref-dep-vowels"></tbody>
        </table>
      </div>
      <div class="ref-section">
        <h3>Pronunciation Guide</h3>
        <div class="ref-phonetic-grid" id="ref-phonetic-grid"></div>
      </div>
      <div class="ref-section">
        <h3>Independent Vowels</h3>
        <div class="ref-grid-5" id="ref-ind-vowels"></div>
      </div>
      <div class="ref-section">
        <h3>Numbers 0–100</h3>
        <div class="ref-num-grid" id="ref-numbers"></div>
      </div>
      <div class="ref-section">
        <h3>Essential Phrases</h3>
        <table class="vowel-table">
          <thead>
            <tr>
              <th>Khmer</th>
              <th>Romanization</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody id="ref-phrases"></tbody>
        </table>
      </div>
    </div>
  </div>


  <div id="page-notebook" class="page">
    <div class="pg-wrap nb-wrap">
      <div class="nb-head">
        <h2>📓 Notebook</h2>
        <button class="bbtn nb-new-btn" onclick="nbNew()">＋ New note</button>
      </div>
      <div class="nb-layout">
        <div class="nb-list" id="nb-list"></div>
        <div class="nb-editor stat-card" id="nb-editor">
          <input class="nb-title" id="nb-title" type="text" placeholder="Title" oninput="nbChanged()" autocomplete="off" />
          <textarea class="nb-body" id="nb-body" placeholder="Write anything… (plain text or Markdown)" oninput="nbChanged()"></textarea>
          <div class="nb-foot">
            <span class="nb-status" id="nb-status"></span>
            <button class="btn-danger nb-del-btn" id="nb-del" onclick="nbDelete()">🗑 Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="page-dash" class="page">
    <div class="dash-wrap">
      <div class="dash-head"><h2>🌐 Dashboard</h2><button class="dash-refresh-btn" id="dash-refresh-btn" onclick="loadDashboard(true)" title="Refresh dashboard now" aria-label="Refresh dashboard"><span class="drb-ico">↻</span><span class="drb-txt">Refresh</span></button></div>
      <div id="dash-loading" aria-hidden="true">
        <div class="stat-cards"><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div><div class="stat-card skel-stat"><div class="skel" style="height:22px;width:60%;margin-bottom:6px"></div><div class="skel" style="height:9px;width:80%"></div></div></div>
        <div class="section-card">
          <div class="skel" style="height:11px;width:45%;margin-bottom:10px"></div>
          <div class="skel" style="height:9px;width:85%;margin-bottom:14px"></div><div class="skel-user-row"><div class="skel-row-top"><div class="skel" style="height:11px;width:40%"></div><div class="skel" style="height:11px;width:18%"></div></div><div class="skel skel-bar"></div></div><div class="skel-user-row"><div class="skel-row-top"><div class="skel" style="height:11px;width:40%"></div><div class="skel" style="height:11px;width:18%"></div></div><div class="skel skel-bar"></div></div><div class="skel-user-row"><div class="skel-row-top"><div class="skel" style="height:11px;width:40%"></div><div class="skel" style="height:11px;width:18%"></div></div><div class="skel skel-bar"></div></div><div class="skel-user-row"><div class="skel-row-top"><div class="skel" style="height:11px;width:40%"></div><div class="skel" style="height:11px;width:18%"></div></div><div class="skel skel-bar"></div></div>
        </div>
        <div class="section-card">
          <div class="skel" style="height:11px;width:50%;margin-bottom:12px"></div><div class="skel-recent-row"><div class="skel-row-top"><div class="skel" style="height:15px;width:30%"></div><div class="skel" style="height:9px;width:22%"></div></div><div class="skel" style="height:11px;width:55%;margin:6px 0"></div><div class="skel" style="height:18px;width:110px;border-radius:6px"></div></div><div class="skel-recent-row"><div class="skel-row-top"><div class="skel" style="height:15px;width:30%"></div><div class="skel" style="height:9px;width:22%"></div></div><div class="skel" style="height:11px;width:55%;margin:6px 0"></div><div class="skel" style="height:18px;width:110px;border-radius:6px"></div></div><div class="skel-recent-row"><div class="skel-row-top"><div class="skel" style="height:15px;width:30%"></div><div class="skel" style="height:9px;width:22%"></div></div><div class="skel" style="height:11px;width:55%;margin:6px 0"></div><div class="skel" style="height:18px;width:110px;border-radius:6px"></div></div><div class="skel-recent-row"><div class="skel-row-top"><div class="skel" style="height:15px;width:30%"></div><div class="skel" style="height:9px;width:22%"></div></div><div class="skel" style="height:11px;width:55%;margin:6px 0"></div><div class="skel" style="height:18px;width:110px;border-radius:6px"></div></div><div class="skel-recent-row"><div class="skel-row-top"><div class="skel" style="height:15px;width:30%"></div><div class="skel" style="height:9px;width:22%"></div></div><div class="skel" style="height:11px;width:55%;margin:6px 0"></div><div class="skel" style="height:18px;width:110px;border-radius:6px"></div></div>
        </div>
        <div class="skel" style="height:26px;width:100%;margin:4px 0 8px;border-radius:var(--r)"></div>
        <div class="skel" style="height:9px;width:60%;margin:0 auto"></div>
      </div>
      <div id="dash-error" style="display:none;text-align:center;padding:40px;color:var(--bad)">
        <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
        <p id="dash-error-msg">Could not load. Connect your sheet in ⚙️.</p>
      </div>
      <div id="dash-content" style="display:none">
        <div class="stat-cards" id="dash-stat-cards"></div>
        <div class="section-card">
          <h3>Users &amp; Word Counts</h3>
          <div style="font-size:.72rem;color:var(--dim);margin-bottom:8px">Tap a user's name here, your name on the top bar, or go to the setings, to view their sheet.</div>
          <div id="dash-users"></div>
        </div>
        <div class="section-card" id="dash-recent-card">
          <div class="dash-recent-head"><h3>Recently Added Words</h3><button type="button" class="dash-collapse-btn" id="dash-collapse-btn" onclick="collapseRecent()" style="display:none" title="Collapse the extra words you loaded">⬆ Collapse</button></div>
          <div id="dash-recent"></div>
          <button class="dash-more-btn" id="dash-more-btn" onclick="showMoreRecent()" style="display:none">⬇ Show more</button>
        </div>
        <div class="dash-stats-note">🕕 Global statistics update daily at 6:00 AM.</div>
        <div style="font-size:.68rem;color:var(--dim);text-align:center;padding-bottom:80px" id="dash-updated"></div>
      </div>
    </div>
  </div>


  <div class="bar" id="bar">Showing 0 entries</div>
  <div class="bulk-bar" id="bulk-bar">
    <span class="bulk-info" id="bulk-info">0 selected</span>
    <button class="bulk-act" id="bulk-study-btn" onclick="studySelectedWords()" style="background:var(--acc);color:#fff;font-weight:600">🎴 Study Selected</button>
    <button class="bulk-act ba-add ro-only" onclick="bulkAddToMySheet()">➕ Add to My Sheet</button>
    <button class="bulk-act ba-cat write-only" onclick="openBulkCat()">📂 Category</button>
    <button class="bulk-act ba-del write-only" onclick="bulkDelete()">🗑 Delete</button>
    <button class="bulk-act ba-clr" onclick="exitBulk()">✕</button>
  </div>
  <div class="tbox" id="tbox"></div>


  <div class="sovl" id="sovl" onclick="sovlBg(event)">
    <div class="esheet">
      <div class="sheet-handle"></div>
      <div class="sheet-top">
        <h3 id="sheet-title">✏️ Edit Entry</h3>
        <div class="sheet-top-btns">
          <button class="star-toggle" id="sheet-star" onclick="toggleEditStar()" title="Favourite">⭐</button>
          <button class="sclose" onclick="closeSheet()">✕</button>
        </div>
      </div>
      <div class="sheet-body">
        <div class="pair-row">
          <div class="fg"><label>English</label><input id="e-en" type="text" autocomplete="off" /></div>
          <div class="fg"><label>Khmer <span class="hint">ភាសាខ្មែរ</span></label><input id="e-kh" class="khi kh" type="text" autocomplete="off" /></div>
        </div>
        <div class="fg"><label>Romanization</label><input id="e-ro" type="text" autocomplete="off" /></div>
        <div class="fg"><label>Notes</label><textarea id="e-no" style="min-height:60px"></textarea></div>
        <div class="fg"><label>Categories <span class="fg-hint">(tap to toggle, pick one or more)</span></label><div class="cat-pick-wrap"><div class="cat-pick" id="e-cats" role="group" aria-label="Categories"></div><button type="button" class="add-cat-btn" onclick="openNewCatModal()" title="Add/edit categories">+</button></div></div>
        <button class="prim-btn write-only" id="edit-btn" onclick="saveEdit()">
          <span id="edit-lbl">💾 Save to Sheet</span><span class="spin" id="edit-spin" style="display:none"></span>
        </button>
        <button class="add-from-other-btn" id="add-from-other-btn" onclick="addWordFromOtherSheet()" style="display:none">➕ Add to My Sheet</button>
        <button class="del-btn write-only" onclick="deleteEntry()">🗑 Delete Entry</button>
      </div>
    </div>
  </div>


  <div class="movl" id="user-ovl">
    <div class="mcard">
      <h3>👋 Khmer Vocab — Log In</h3>
      <p style="font-size:.79rem;color:var(--dim);margin-bottom:14px;line-height:1.5">Enter your name and password to log in. If you're new, this will create your account.</p>
      <p style="font-size:.79rem;color:var(--dim);margin-bottom:14px;line-height:1.5">Be careful. You can only recover this if you forgotten, or change this by contacting me here:<br>Email: <a href="mailto:olsen.porter@missionary.org" style="color:#6b9bd1;text-decoration:underline">olsen.porter@missionary.org</a><br>Messenger: <a href="https://m.me/olsen.porter" target="_blank" rel="noopener noreferrer" style="color:#6b9bd1;text-decoration:underline">m.me/olsen.porter</a></p>
      <label style="font-size:.7rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:6px">Name</label>
      <input class="minput" id="user-inp" type="text" placeholder="Enter your name…" autocomplete="username" />
      <label style="font-size:.7rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:6px">Password</label>
      <input class="minput" id="user-pass" type="password" placeholder="Enter your password…" autocomplete="current-password" />
      <div id="user-login-msg" style="display:none;font-size:.78rem;margin:8px 0 8px;padding:9px 11px;border-radius:8px;line-height:1.4"></div>
      <button class="user-start" id="user-start-btn" onclick="handleLogin()">Log In →</button>
    </div>
  </div>


  <div class="movl" id="user-step2-ovl">
    <div class="mcard">
      <h3>📂 Do you have a vocabulary CSV file?</h3>
      <p>If you already have a CSV file of Khmer vocabulary, you can import it now. You can also do this later from Settings. If you press "Yes, import CSV now" there will be step by step instructions on how to do it, and you can still choose to cancel.</p>
      <div style="display:flex;flex-direction:column;gap:9px;margin-top:6px">
        <button class="prim-btn" style="margin-top:0" onclick="closeStep2AndImport()">📂 Yes, import CSV now</button>
        <button class="btn-g" style="width:100%;height:46px;font-size:.9rem" onclick="closeStep2()">No thanks, start fresh</button>
      </div>
    </div>
  </div>


  <div class="movl" id="acct-quick-ovl" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="mcard" style="max-width:380px">
      <h3>👤 Your Account</h3>
      <div style="background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:10px 13px;margin-bottom:14px;display:flex;align-items:center;gap:10px">
        <div style="flex:1">
          <div style="font-size:.85rem;font-weight:700;color:var(--acc3)" id="aq-name">—</div>
          <div style="font-size:.7rem;color:var(--dim);margin-top:2px">Main account</div>
        </div>
        <span style="font-size:.65rem;color:var(--ok);background:rgba(34,197,94,.1);border-radius:10px;padding:2px 8px">Active</span>
      </div>
      <div style="font-size:.7rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">View other accounts (read-only)</div>
      <div class="user-search-wrap"><input type="search" id="aq-user-search" class="user-search-inp" placeholder="🔍 Search accounts…" autocomplete="off" oninput="filterUserList('aq-user-list','aq-user-search')" /></div>
      <div class="user-list" id="aq-user-list">
        <div style="font-size:.75rem;color:var(--dim);text-align:center;padding:10px">Connect your sheet to see other accounts</div>
      </div>
      <button class="btn-g refresh-users-btn" style="width:100%;font-size:.76rem;margin-bottom:10px" id="aq-refresh-btn" onclick="fetchOtherUsersForPopup()"><span class="rib-txt">↻ Refresh from sheet</span></button>
      <div class="macts">
        <button class="btn-danger" onclick="logout()" style="font-size:.78rem">🚪 Log Out</button>
        <button class="btn-g" onclick="el('acct-quick-ovl').classList.remove('open')">Close</button>
      </div>
    </div>
  </div>


  <div class="movl" id="imp-prog-ovl" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="mcard" style="max-width:360px">
      <h3 id="imp-prog-title">📥 Progress</h3>
      <div class="imp-prog-card" id="imp-bar-section-1">
        <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:6px">
          <span id="imp-label">Preparing…</span><span id="imp-pct" style="color:var(--acc3);font-weight:700">0%</span>
        </div>
        <div class="imp-prog-bar-bg">
          <div class="imp-prog-bar-fill" id="imp-bar" style="width:0%"></div>
        </div>
        <div style="font-size:.72rem;color:var(--dim);margin-top:4px" id="imp-detail"></div>
      </div>
      <div class="imp-prog-card" id="imp-bar-section-2" style="display:none;margin-top:8px">
        <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:6px">
          <span id="save-label">Saving…</span><span id="save-pct" style="color:var(--acc3);font-weight:700">0%</span>
        </div>
        <div class="imp-prog-bar-bg">
          <div class="imp-prog-bar-fill" id="save-bar" style="width:0%"></div>
        </div>
        <div style="font-size:.72rem;color:var(--dim);margin-top:4px" id="save-detail"></div>
      </div>
      <div class="macts" style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">
        <button class="btn-danger" id="imp-cancel-btn" onclick="cancelPendingUpload()" style="font-size:.78rem;padding:6px 12px">⏹ Cancel Upload</button>
        <button class="btn-g" onclick="el('imp-prog-ovl').classList.remove('open')">Close</button>
      </div>
    </div>
  </div>


  <div class="movl" id="cfg-ovl" onclick="if(event.target===this)closeCfg()">
    <div class="mcard" style="max-width:520px">
      <h3>⚙️ Settings</h3>


      <div class="cfg-section">
        <div class="cfg-section-title">Appearance</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Theme</div>
            <div class="cr-sub">Switch between dark and light mode</div>
          </div>
          <button class="btn-g" id="theme-toggle-btn" onclick="toggleTheme()" style="font-size:.8rem;padding:7px 13px">☀️ Light mode</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Full screen</div>
            <div class="cr-sub">Toggle browser full screen</div>
          </div>
          <button class="btn-g" id="fullscreen-btn" onclick="toggleFullscreen()" style="font-size:.8rem;padding:7px 13px">⛶ Full Screen</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Full screen on open</div>
            <div class="cr-sub">Show overlay to enter full screen when opened</div>
          </div>
          <label class="tog"><input type="checkbox" id="opt-auto-fullscreen" onchange="saveSettings()"><span class="tog-sl"></span></label>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Accent colour</div>
          </div>
        </div>
        <div class="accent-row" id="accent-row"></div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Display</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Default page on open</div>
          </div>
          <select id="opt-default-page" onchange="saveSettings()">
            <option value="add">➕ Add Word</option>
            <option value="view">📋 View</option>
            <option value="study">🎴 Study</option>
            <option value="progress">📊 Progress</option>
            <option value="ref">📚 Reference</option>
            <option value="trans">🔤 Translate</option>
            <option value="dash">🌐 Dashboard</option>
            <option value="notebook">📓 Notebook</option>
          </select>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Row density</div>
          </div>
          <select id="opt-density" onchange="applyDensity()">
            <option value="comfortable">Comfortable</option>
            <option value="compact" selected>Compact</option>
          </select>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Highlight search matches</div>
          </div>
          <label class="tog"><input type="checkbox" id="opt-highlight" checked onchange="saveSettings()"><span class="tog-sl"></span></label>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Show Blur Buttons in Word Index</div>
            <div class="cr-sub">Show the 🙈 KH / 🙈 EN buttons above the word list</div>
          </div>
          <label class="tog"><input type="checkbox" id="opt-blurbtns" onchange="saveSettings();applyBlurBtns()"><span class="tog-sl"></span></label>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Visible columns</div>
            <div class="col-toggle-grid" style="margin-top:6px">
              <label class="col-tog-lbl"><input type="checkbox" id="col-en" checked onchange="applyColumns()">English</label>
              <label class="col-tog-lbl"><input type="checkbox" id="col-kh" checked onchange="applyColumns()">Khmer</label>
              <label class="col-tog-lbl"><input type="checkbox" id="col-ro" checked onchange="applyColumns()">Romanization</label>
              <label class="col-tog-lbl"><input type="checkbox" id="col-no" checked onchange="applyColumns()">Notes</label>
              <label class="col-tog-lbl"><input type="checkbox" id="col-ca" checked onchange="applyColumns()">Category</label>
              <label class="col-tog-lbl"><input type="checkbox" id="col-dt" onchange="applyColumns()">Date</label>
            </div>
          </div>
        </div>
        <div class="cfg-row" style="flex-wrap:wrap;gap:4px">
          <div class="cfg-row-left">
            <div class="cr-title">English font size <span id="en-fs-label" style="color:var(--acc3);font-size:.72rem"></span></div>
          </div>
          <div style="display:flex;align-items:center;gap:5px">
            <input type="number" id="opt-enfontsize-num" min="10" max="24" value="14" disabled style="width:52px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('fs-en-lock').checked){el('opt-enfontsize').value=this.value;applyEnFontSize()}">
            <input type="range" id="opt-enfontsize" min="10" max="24" value="14" disabled oninput="applyEnFontSize();el('opt-enfontsize-num').value=this.value">
            <label title="Lock font size" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="fs-en-lock" checked onchange="var d=this.checked;el('opt-enfontsize').disabled=d;el('opt-enfontsize-num').disabled=d"> 🔒</label>
          </div>
        </div>
        <div class="cfg-row" style="flex-wrap:wrap;gap:4px">
          <div class="cfg-row-left">
            <div class="cr-title">Khmer font size <span id="kh-fs-label" style="color:var(--acc3);font-size:.72rem"></span></div>
          </div>
          <div style="display:flex;align-items:center;gap:5px">
            <input type="number" id="opt-khfontsize-num" min="12" max="28" value="16" disabled style="width:52px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('fs-kh-lock').checked){el('opt-khfontsize').value=this.value;applyKhFontSize()}">
            <input type="range" id="opt-khfontsize" min="12" max="28" value="16" disabled oninput="applyKhFontSize();el('opt-khfontsize-num').value=this.value">
            <label title="Lock font size" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="fs-kh-lock" checked onchange="var d=this.checked;el('opt-khfontsize').disabled=d;el('opt-khfontsize-num').disabled=d"> 🔒</label>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Khmer font</div>
            <div class="text-preview">
              <div class="tp-row"><span class="tp-label">English</span><span class="tp-en" id="tp-en">Hello, good morning</span></div>
              <div class="tp-row"><span class="tp-label">Khmer</span><span class="tp-kh kh" id="tp-kh">ជំរាបសួរ</span></div>
              <div class="tp-row"><span class="tp-label">Ro</span><span class="tp-ro" id="tp-ro">oh-LAH</span></div>
            </div>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Khmer font style</div>
          </div>
          <select id="opt-khfont" onchange="applyKhFont()">
            <option value="'Noto Sans Khmer',system-ui,sans-serif">Noto Sans Khmer</option>
            <option value="'Noto Serif Khmer',serif">Noto Serif Khmer</option>
            <option value="'Battambang',serif">Battambang</option>
            <option value="'Hanuman',serif">Hanuman</option>
            <option value="'Moul',serif">Moul</option>
            <option value="system-ui,sans-serif">System Default</option>
          </select>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">English font style</div>
          </div>
          <select id="opt-enfont" onchange="applyEnFont()">
            <option value="system-ui,-apple-system,'Segoe UI',sans-serif">System Default</option>
            <option value="'Georgia',Georgia,serif">Georgia</option>
            <option value="'Times New Roman',Times,serif">Times New Roman</option>
            <option value="'Palatino Linotype',Palatino,serif">Palatino</option>
            <option value="'Helvetica Neue',Helvetica,Arial,sans-serif">Helvetica / Arial</option>
            <option value="Verdana,Geneva,sans-serif">Verdana</option>
            <option value="'Trebuchet MS',Helvetica,sans-serif">Trebuchet MS</option>
            <option value="'Courier New',Courier,monospace">Courier New (Mono)</option>
            <option value="'Comic Sans MS','Comic Sans',cursive">Comic Sans</option>
          </select>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Column Widths</div>
        <div style="font-size:.74rem;color:var(--dim);margin-bottom:10px">Drag to resize each column. For reference the total width of your screen is probably around 375px if it's similar to mine.</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="cfg-row" style="flex-wrap:wrap;gap:4px"><div class="cfg-row-left"><div class="cr-title">English <span id="cw-en-lbl" style="color:var(--acc3);font-size:.72rem"></span></div></div><div style="display:flex;align-items:center;gap:5px"><input type="number" id="cw-en-num" min="80" max="400" value="160" style="width:58px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('cw-en-lock').checked){applyColWidth('en',this.value);el('cw-en').value=this.value}"><input type="range" id="cw-en" min="80" max="400" value="160" oninput="applyColWidth('en',this.value);el('cw-en-num').value=this.value"><label title="Lock column width" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="cw-en-lock" checked onchange="el('cw-en').disabled=this.checked;el('cw-en-num').disabled=this.checked"> 🔒</label></div></div>
          <div class="cfg-row" style="flex-wrap:wrap;gap:4px"><div class="cfg-row-left"><div class="cr-title">Khmer <span id="cw-kh-lbl" style="color:var(--acc3);font-size:.72rem"></span></div></div><div style="display:flex;align-items:center;gap:5px"><input type="number" id="cw-kh-num" min="80" max="400" value="180" style="width:58px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('cw-kh-lock').checked){applyColWidth('kh',this.value);el('cw-kh').value=this.value}"><input type="range" id="cw-kh" min="80" max="400" value="180" oninput="applyColWidth('kh',this.value);el('cw-kh-num').value=this.value"><label title="Lock column width" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="cw-kh-lock" checked onchange="el('cw-kh').disabled=this.checked;el('cw-kh-num').disabled=this.checked"> 🔒</label></div></div>
          <div class="cfg-row" style="flex-wrap:wrap;gap:4px"><div class="cfg-row-left"><div class="cr-title">Romanization <span id="cw-ro-lbl" style="color:var(--acc3);font-size:.72rem"></span></div></div><div style="display:flex;align-items:center;gap:5px"><input type="number" id="cw-ro-num" min="60" max="400" value="150" style="width:58px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('cw-ro-lock').checked){applyColWidth('ro',this.value);el('cw-ro').value=this.value}"><input type="range" id="cw-ro" min="60" max="400" value="150" oninput="applyColWidth('ro',this.value);el('cw-ro-num').value=this.value"><label title="Lock column width" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="cw-ro-lock" checked onchange="el('cw-ro').disabled=this.checked;el('cw-ro-num').disabled=this.checked"> 🔒</label></div></div>
          <div class="cfg-row" style="flex-wrap:wrap;gap:4px"><div class="cfg-row-left"><div class="cr-title">Notes <span id="cw-no-lbl" style="color:var(--acc3);font-size:.72rem"></span></div></div><div style="display:flex;align-items:center;gap:5px"><input type="number" id="cw-no-num" min="60" max="400" value="170" style="width:58px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('cw-no-lock').checked){applyColWidth('no',this.value);el('cw-no').value=this.value}"><input type="range" id="cw-no" min="60" max="400" value="170" oninput="applyColWidth('no',this.value);el('cw-no-num').value=this.value"><label title="Lock column width" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="cw-no-lock" checked onchange="el('cw-no').disabled=this.checked;el('cw-no-num').disabled=this.checked"> 🔒</label></div></div>
          <div class="cfg-row" style="flex-wrap:wrap;gap:4px"><div class="cfg-row-left"><div class="cr-title">Category <span id="cw-ca-lbl" style="color:var(--acc3);font-size:.72rem"></span></div></div><div style="display:flex;align-items:center;gap:5px"><input type="number" id="cw-ca-num" min="60" max="300" value="110" style="width:58px;padding:3px 5px;border:1px solid var(--bdr);border-radius:5px;background:var(--surf);color:var(--text);font-size:.8rem" oninput="if(!el('cw-ca-lock').checked){applyColWidth('ca',this.value);el('cw-ca').value=this.value}"><input type="range" id="cw-ca" min="60" max="300" value="110" oninput="applyColWidth('ca',this.value);el('cw-ca-num').value=this.value"><label title="Lock column width" style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:.8rem;white-space:nowrap"><input type="checkbox" id="cw-ca-lock" checked onchange="el('cw-ca').disabled=this.checked;el('cw-ca-num').disabled=this.checked"> 🔒</label></div></div>
        </div>
        <button class="btn-g" style="font-size:.74rem;padding:7px 12px;margin-top:6px" onclick="resetColWidths()">Reset widths</button>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Audio</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Text-to-speech</div>
            <div class="cr-sub">Speak Khmer and English words aloud everywhere in the app</div>
          </div>
          <label class="tog"><input type="checkbox" id="opt-tts" onchange="saveSettings()"><span class="tog-sl"></span></label>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Dashboard</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Words per “Show more”</div>
            <div class="cr-sub">How many Recently Added Words load each time you tap Show more</div>
          </div>
          <select id="opt-recent-page" onchange="saveSettings()">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Account &amp; Identity</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Logged in as</div>
            <div class="cr-sub" id="cfg-uname">—</div>
          </div>
          <button class="btn-danger" onclick="logout();closeCfg();" style="font-size:.74rem;padding:6px 11px;height:auto">🚪 Log Out</button>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">View Other Accounts</div>
        <div style="background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.3);border-radius:10px;padding:10px 13px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:700;color:var(--acc3)" id="cfg-aq-name">—</div>
            <div style="font-size:.7rem;color:var(--dim);margin-top:2px">Main account</div>
          </div>
          <span style="font-size:.65rem;color:var(--ok);background:rgba(34,197,94,.1);border-radius:10px;padding:2px 8px">Active</span>
        </div>
        <div style="font-size:.7rem;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Other accounts (read-only)</div>
        <div class="user-search-wrap"><input type="search" id="cfg-user-search" class="user-search-inp" placeholder="🔍 Search accounts…" autocomplete="off" oninput="filterUserList('cfg-user-list','cfg-user-search')" /></div>
        <div class="user-list" id="cfg-user-list">
          <div style="font-size:.75rem;color:var(--dim);text-align:center;padding:10px">Connect your sheet to see other accounts</div>
        </div>
        <button class="btn-g refresh-users-btn" style="width:100%;font-size:.76rem;margin-bottom:0" id="cfg-refresh-btn" onclick="fetchOtherUsersForSettings()"><span class="rib-txt">↻ Refresh from sheet</span></button>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Sheet Connection</div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Last synced</div>
            <div class="cr-sub sync-time" id="cfg-last-sync">Never</div>
          </div>
          <button class="btn-s" onclick="doSyncClick();closeCfg()" style="font-size:.76rem;padding:7px 12px">Sync Now</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Cache</div>
            <div class="cr-sub" id="cfg-cache-info">No cache yet</div>
          </div>
          <button class="btn-g" onclick="clearCache()" style="font-size:.76rem;padding:7px 11px">Clear</button>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Data</div>
        <div style="margin-bottom:10px">
          <button class="import-btn-big" onclick="openImportModal()">📂 Import from CSV File</button>
          <div style="font-size:.7rem;color:var(--dim);text-align:center">Bulk-add words from a Google Sheets export</div>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Export to CSV</div>
            <div class="cr-sub">Download all vocabulary as a spreadsheet file</div>
          </div>
          <button class="btn-s" onclick="exportCSV()" style="font-size:.76rem;padding:7px 12px">Export</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Export all data</div>
            <div class="cr-sub">Backup vocab, settings &amp; progress as JSON</div>
          </div>
          <button class="btn-s" onclick="exportAllData()" style="font-size:.76rem;padding:7px 12px">Export JSON</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Import all data</div>
            <div class="cr-sub">Restore vocab, settings &amp; progress from JSON</div>
          </div>
          <button onclick="importAllData()" style="font-size:.76rem;padding:7px 12px;background:var(--surf2);border:2px dashed var(--bdr);border-radius:var(--r);color:var(--dim);cursor:pointer;font-family:inherit;touch-action:manipulation;transition:all .18s" onmouseover="this.style.borderColor='var(--acc2)';this.style.color='var(--acc3)'" onmouseout="this.style.borderColor='var(--bdr)';this.style.color='var(--dim)'">📂 Import JSON</button>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Reset confidence &amp; SRS</div>
          </div>
          <button class="btn-danger" onclick="resetConfidence()" style="font-size:.76rem;padding:7px 11px">Reset</button>
        </div>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Tab Order</div>
        <div style="font-size:.74rem;color:var(--dim);margin-bottom:10px">Drag or use the arrows to reorder navigation tabs.</div>
        <div id="tab-order-list" style="display:flex;flex-direction:column;gap:5px"></div>
        <div style="height:6px"></div>
        <button class="btn-g" style="font-size:.74rem;padding:7px 12px" onclick="resetTabOrder()">Reset to default</button>
      </div>


      <div class="cfg-section">
        <div class="cfg-section-title">Visible Tabs</div>
        <div style="font-size:.74rem;color:var(--dim);margin-bottom:10px">Turn a tab off to hide it from the navigation bar. At least one tab stays visible.</div>
        <div id="tab-visible-list" style="display:flex;flex-direction:column;gap:5px"></div>
        <div style="height:6px"></div>
        <button class="btn-g" style="font-size:.74rem;padding:7px 12px" onclick="resetHiddenTabs()">Show all tabs</button>
      </div>


      <div class="cfg-section">
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Support</div>
            <div class="cr-sub">
              <div class="cr-sub">1. <a href="olsen.porter@missionary.org" style="text-decoration:underline;color:#6b9bd1">olsen.porter@missionary.org</a></div>
              <div class="cr-sub">2. <a href="https://m.me/olsen.porter" style="text-decoration:underline;color:#6b9bd1">https://m.me/olsen.porter</a></div>
            </div>
          </div>
          <span style="font-size:.72rem;color:var(--dim)">Email &<br>Messenger</span>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Links</div>
            <div class="cr-sub">
              <div class="cr-sub">1. <a href="https://docs.google.com/document/d/1ynpcFYYxTFDjj9exho4jvJZeWI55VQJDmJutVzQgH30/edit?usp=drivesdk" target="_blank" rel="noopener" style="text-decoration:underline;color:#6b9bd1">Changelog</a></div>
              <div class="cr-sub">2. <a href="https://docs.google.com/document/d/1s1HbAuR1h9jH_MAjnk0gMCkzKoHNU9Sa1DiXR61RpgU/edit?usp=drivesdk" target="_blank" rel="noopener" style="text-decoration:underline;color:#6b9bd1">Feature Requests & Bug Reports</a></div>
            </div>
          </div>
          <span style="font-size:.72rem;color:var(--dim)">Extenal<br>Docs</span>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Khmer Vocabulary</div>
            <div class="cr-sub">Personal or Social learning tool</div>
          </div>
          <span style="font-size:.72rem;color:var(--dim)" id="cfg-version-label">v9.0.5</span>
        </div>
        <div class="cfg-row">
          <div class="cfg-row-left">
            <div class="cr-title">Made By:</div>
            <div class="cr-sub">Porter Olsen</div>
          </div>
          <span style="font-size:.72rem;color:var(--dim)">(Ion-o-koji)</span>
        </div>
      </div>
      <div class="macts" style="margin-top:4px"><button class="btn-g" onclick="closeCfg()">Close</button></div>
    </div>
  </div>


  <div class="movl" id="conf-words-ovl" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="mcard" style="max-width:480px">
      <h3 id="conf-words-title">Words</h3>
      <div id="conf-words-list" style="max-height:55vh;overflow-y:auto;padding-right:4px"></div>
      <div class="macts" style="margin-top:14px">
        <button class="btn-g" onclick="el('conf-words-ovl').classList.remove('open')">Close</button>
        <button id="conf-words-study-btn" class="btn-s" onclick="_studyConfWords()" style="background:var(--acc3)">&#x1F4DA; Study These</button>
      </div>
    </div>
  </div>


  <div class="movl" id="import-ovl" onclick="if(event.target===this)closeImportModal()">
    <div class="mcard">
      <h3>📂 Import from Google Sheets CSV</h3>


      <div class="step-box">
        <div class="step-title">How to prepare and download your CSV:</div>
        <div class="step-row">
          <div class="step-num">1</div>
          <div class="step-text">Open <strong>Google Sheets</strong> Create a new spreadsheet.</div>
        </div>
        <div class="step-row">
          <div class="step-num">2</div>
          <div class="step-text">In <strong>Row 1</strong>, type these headers exactly in columns A through D:<br><code>English</code> &nbsp; <code>Khmer</code> &nbsp; <code>Romanization</code> &nbsp; <code>Notes</code></div>
        </div>
        <div class="step-row">
          <div class="step-num">3</div>
          <div class="step-text">Fill in your words starting from <strong>Row 2</strong>. English in column A, Khmer script in column B. All columns are optional except English or Khmer.</div>
        </div>
        <div class="step-row">
          <div class="step-num">4</div>
          <div class="step-text">Make sure you are <strong>in the Google Sheets</strong> then go to:<br><strong>The 3 lines, top right (⋮) → Shere & Export → Save As → CSV (current sheet) → Upload</strong></div>
        </div>
        <div class="step-row">
          <div class="step-num">5</div>
          <div class="step-text">Go back to the main <strong>Google Sheets</strong> page and download the <strong>CSV</strong> sheet</div>
        </div>
        <div class="step-row">
          <div class="step-num">6</div>
          <div class="step-text">Choose that .csv file when you press the button below (It should be in you download folder). Duplicates are skipped. Date defaults to today if blank.</div>
        </div>
      </div>


      <div class="csv-example">
        <div class="ex-label">Example of what your filled Google Sheet should look like:</div>
        <table class="ex-table">
          <thead>
            <tr>
              <th>English</th>
              <th>Khmer</th>
              <th>Romanization</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>water</td>
              <td class="kh">ទឹក</td>
              <td>tuk</td>
              <td>drinking water</td>
            </tr>
            <tr>
              <td>house</td>
              <td class="kh"></td>
              <td>pteah</td>
              <td></td>
            </tr>
            <tr>
              <td>country</td>
              <td class="kh">ស្រុក</td>
              <td></td>
              <td>also means village</td>
            </tr>
          </tbody>
        </table>
      </div>


      <div class="csv-dl-note">
        📍 <strong>Important:</strong> You must follow the steps <strong>exactly</strong>, you must also be in the sheet and save to CSV.<br>
        - You must also format the sheet <strong>exactly</strong>
      </div>


      <div class="csv-err" id="csv-err"></div>


      <div id="csv-main-area">
        <input type="file" id="csv-file-input" accept=".csv,text/csv" style="display:none" onchange="handleCsvFile(event)">
        <button class="import-btn-big" onclick="el('csv-file-input').click()">📁 Choose CSV File</button>
        <div id="csv-file-name" style="font-size:.72rem;color:var(--dim);text-align:center;margin-top:4px"></div>
      </div>


      <div class="csv-loading" id="csv-loading">
        <div class="csv-spinner"></div>
        <div class="csv-loading-txt" id="csv-loading-txt">Reading file…</div>
      </div>


      <div id="csv-preview" style="display:none;margin-bottom:12px">
        <div style="font-size:.75rem;font-weight:700;color:var(--text);margin-bottom:6px" id="csv-preview-title"></div>
        <div style="background:var(--surf2);border-radius:8px;padding:10px;max-height:140px;overflow-y:auto" id="csv-preview-list"></div>
      </div>


      <div class="macts">
        <button class="btn-g" onclick="closeImportModal()">Cancel</button>
        <button class="btn-s" id="csv-import-btn" onclick="confirmImport()" disabled style="opacity:.5">
          <span id="csv-import-lbl">Import</span>
        </button>
      </div>
    </div>
  </div>


  <div class="movl" id="bulkcat-ovl" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="mcard">
      <h3>📂 Change Category</h3>
      <p>Move <span id="bulkcat-count">0</span> selected entries to:</p>
      <div style="display:flex;gap:6px;align-items:center"><select class="minput" id="bulkcat-sel" style="height:46px;margin-bottom:14px"></select><button type="button" class="add-cat-btn" onclick="openNewCatModal()" title="Add/edit categories">+</button></div>
      <div class="macts">
        <button class="btn-g" onclick="el('bulkcat-ovl').classList.remove('open')">Cancel</button>
        <button class="btn-s" onclick="applyBulkCat()">Apply &amp; Sync</button>
      </div>
    </div>
  </div>
  </div>


  <div class="movl" id="newcat-ovl" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="mcard">
      <h3>🏷 Manage Categories</h3>
      <p>Custom categories appear in all dropdowns and sync to your sheet. Names can't contain commas.</p>
      <div style="display:flex;gap:7px;margin-bottom:12px">
        <input class="minput" id="newcat-inp" type="text" placeholder="New category name…" style="flex:1;margin-bottom:0" />
        <button class="btn-s newcat-add-btn" onclick="addCustomCat()">＋ Add</button>
      </div>
      <div id="custom-cat-list" style="display:flex;flex-direction:column;gap:7px;margin-bottom:8px;max-height:260px;overflow-y:auto"></div>
      <div class="macts"><button class="btn-g" onclick="el('newcat-ovl').classList.remove('open')">Done</button></div>
    </div>
  </div>
  `;
    })();

    var URL_KEY = 'kv_url',
      MAINUSER_KEY = 'kv_main_user',
      SKEY = 'kv_settings',
      FAV_KEY = 'kv_favorites',
      CONF_KEY = 'kv_confidence',
      SRS_KEY = 'kv_srs',
      CACHE_KEY = 'kv_cache',
      SYNC_KEY = 'kv_last_sync',
      CATS_KEY = 'kv_custom_cats',
      SETS_KEY = 'kv_study_sets',
      QUEUE_KEY = 'kv_pending_queue',
      DELETED_CATS_KEY = 'kv_deleted_cats',
      CAT_ORDER_KEY = 'kv_cat_order',
      COL_WIDTHS_KEY = 'kv_col_widths',
      STREAK_KEY = 'kv_streak',
      ACHV_KEY = 'kv_achievements',
      COMEBACK_KEY = 'kv_comeback_count',
      WEEKLY_ADD_KEY = 'kv_weekly_adds',
      BURGLAR_KEY = 'kv_burglar_count',
      EXPLORER_KEY = 'kv_explorer_count',
      THEME_KEY = 'kv_theme',
      BEST_STREAK_KEY = 'kv_best_streak',
      EARLY_BIRD_KEY = 'kv_early_bird_count',
      NIGHT_OWL_KEY = 'kv_night_owl_count',
      COMPETITIVE_KEY = 'kv_competitive_won',
      USERS_CACHE_KEY = 'kv_users_cache',
      USERDATA_SYNC_KEY = 'kv_userdata_hash';
    var USERS_CACHE_MS = 24 * 3600000;
    var DASH_STORE_KEY = 'kv_dash_cache';
    var REPORTS_KEY = 'kv_report_history';
    var NOTEBOOK_KEY = 'kv_notebook';

    // ── Notebook (local only, auto-saved) ──
    var nbNotes = null, nbActive = null, _nbSaveT = null;
    function nbLoad() {
      if (nbNotes) return;
      nbNotes = safeJsonParse(ls(NOTEBOOK_KEY), []);
      if (!Array.isArray(nbNotes)) nbNotes = [];
    }
    function nbPersist() { lsSet(NOTEBOOK_KEY, JSON.stringify(nbNotes)); }
    function nbInit() {
      nbLoad();
      if (!nbNotes.length) nbNew(true);
      if (!nbActive || !nbNotes.some(function(n) { return n.id === nbActive; })) nbActive = nbNotes[0].id;
      nbRenderList(); nbOpen(nbActive);
    }
    function nbNew(silent) {
      nbLoad();
      nbFlush();
      var n = { id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: '', body: '', updated: Date.now() };
      nbNotes.unshift(n); nbActive = n.id; nbPersist();
      if (!silent) { nbRenderList(); nbOpen(n.id); var t = el('nb-title'); if (t) t.focus(); }
    }
    function nbRenderList() {
      var box = el('nb-list'); if (!box) return;
      box.innerHTML = nbNotes.map(function(n) {
        var d = new Date(n.updated);
        var when = ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + d.getFullYear();
        return '<button type="button" class="nb-item' + (n.id === nbActive ? ' active' : '') + '" onclick="nbOpen(\'' + n.id + '\')">' +
          '<span class="nb-item-t">' + esc(n.title || 'Untitled note') + '</span>' +
          '<span class="nb-item-d">' + when + ' · ' + esc((n.body || '').slice(0, 40).replace(/\s+/g, ' ')) + '</span></button>';
      }).join('');
    }
    function nbOpen(id) {
      nbFlush();
      var n = nbNotes.filter(function(x) { return x.id === id; })[0]; if (!n) return;
      nbActive = id;
      el('nb-title').value = n.title || ''; el('nb-body').value = n.body || '';
      el('nb-status').textContent = 'Saved';
      nbRenderList();
    }
    function nbFlush() {
      if (!_nbSaveT) return;
      clearTimeout(_nbSaveT); _nbSaveT = null; nbSaveNow();
    }
    function nbSaveNow() {
      var n = nbNotes && nbNotes.filter(function(x) { return x.id === nbActive; })[0]; if (!n) return;
      n.title = el('nb-title').value; n.body = el('nb-body').value; n.updated = Date.now();
      nbPersist(); el('nb-status').textContent = 'Saved ✓'; nbRenderList();
    }
    function nbChanged() {
      el('nb-status').textContent = 'Saving…';
      clearTimeout(_nbSaveT);
      _nbSaveT = setTimeout(function() { _nbSaveT = null; nbSaveNow(); }, 400);
    }
    function nbDelete() {
      var n = nbNotes.filter(function(x) { return x.id === nbActive; })[0]; if (!n) return;
      if (!confirm('Delete "' + (n.title || 'Untitled note') + '"? This cannot be undone.')) return;
      clearTimeout(_nbSaveT); _nbSaveT = null;
      nbNotes = nbNotes.filter(function(x) { return x.id !== n.id; });
      nbActive = null; nbPersist();
      nbInit();
      toast('Note deleted', 'ok');
    }
    window.addEventListener('beforeunload', function() { try { nbFlush(); } catch (e) {} });
    var _myRowsSnapshot = null;


    var APP_VERSION = '9.0.5';
    var LAST_SEEN_VERSION_KEY = 'kv_last_seen_version';
    var CHANGELOG_URL = 'https://docs.google.com/document/d/1ynpcFYYxTFDjj9exho4jvJZeWI55VQJDmJutVzQgH30/edit?usp=drivesdk';

    var SCRIPT_URL = ls(URL_KEY) || 'https://script.google.com/macros/s/AKfycbyDi_7tFPgPIZHPj4xbG12J_IBkppBBnpGShk2znkl5BEhTm3uTdbaCK6EGnbBBfWwi/exec';


    var ADMIN_USER = 'Porter Olsen';
    var MAIN_USER = ls(MAINUSER_KEY) || '';
    var CURRENT_USER = MAIN_USER;
    var readOnlyMode = false;
    var allRows = [],
      quickSort = 'date',
      sortCol = -1,
      sortAsc = true,
      blurMode = '';
    var editRow = null,
      bulkMode = false,
      selectedKeys = new Set();
    var autoSyncTimer = null,
      favSortCol = -1,
      favSortAsc = true,
      csvParsed = [];
    var studyDir = 'kh',
      submitLock = false,
      submitLockTimer = null,
      ttsAudio = null;
    var activeTasks = 0;
    var lastWriteTime = 0;

    var favorites = new Set(safeJsonParse(ls(FAV_KEY), []));
    var confidence = safeJsonParse(ls(CONF_KEY), {});
    // ── Compact SM-2 transport codec (v9.0.0) ──
    // localStorage keeps the verbose object map (all study code reads it unchanged).
    // The sheet backup uses:  {"v":2,"d":{"<wordKey>":[reps, interval, ease, dueSec, lastSec]}}
    // Cards with 0 reps and no due date are omitted. srsFromAny() reads BOTH formats.
    function srsToCompact(map) {
      var d = {};
      Object.keys(map || {}).forEach(function(k) {
        var e = map[k];
        if (!e || typeof e !== 'object') return;
        var reps = Number(e.repetitions != null ? e.repetitions : e.reps) || 0;
        var due = Number(e.dueDate != null ? e.dueDate : e.nextReview) || 0;
        if (!reps && !due) return;
        d[k] = [reps, Math.round((Number(e.interval) || 0) * 100) / 100, Math.round((Number(e.easeFactor || e.ease) || 2.5) * 100) / 100,
          Math.round(due / 1000), Math.round((Number(e.lastReview) || 0) / 1000)];
      });
      return JSON.stringify({ v: 2, d: d });
    }
    function srsFromAny(v) {
      var o = typeof v === 'string' ? safeJsonParse(v, {}) : v;
      if (!o || typeof o !== 'object') return {};
      if (!(o.v === 2 && o.d && typeof o.d === 'object')) return o; // legacy verbose map
      var out = {};
      Object.keys(o.d).forEach(function(k) {
        var a = o.d[k];
        if (!a || !a.length) return;
        var due = Number(a[3]) ? Number(a[3]) * 1000 : null;
        out[k] = { reps: Number(a[0]) || 0, interval: Number(a[1]) || 0, ease: Number(a[2]) || 2.5,
          dueDate: due, nextReview: due, lastReview: Number(a[4]) ? Number(a[4]) * 1000 : null, sm2: 1 };
      });
      return out;
    }
    var srsData = srsFromAny(ls(SRS_KEY));
    (function upgradeSrsToSm2() {
      var changed = false;
      Object.keys(srsData).forEach(function(k) {
        if (!srsData[k] || srsData[k].sm2 !== 1) { srsData[k] = normalizeSrsEntry(srsData[k]); changed = true; }
      });
      if (changed || /^\s*\{\s*"v"\s*:\s*2/.test(ls(SRS_KEY) || '')) lsSet(SRS_KEY, JSON.stringify(srsData));
    })();
    var customCats = safeJsonParse(ls(CATS_KEY), []);
    var tempGuestCats = [];
    var deletedCats = safeJsonParse(ls(DELETED_CATS_KEY), []);
    var catOrder = safeJsonParse(ls(CAT_ORDER_KEY), []);
    var colWidths = safeJsonParse(ls(COL_WIDTHS_KEY), {});
    var studySets = safeJsonParse(ls(SETS_KEY), []);
    var pendingQueue = safeJsonParse(ls(QUEUE_KEY), []);
    var achievements = safeJsonParse(ls(ACHV_KEY), {});
    var importState = {
      active: false,
      total: 0,
      sent: 0,
      failed: 0,
      label: ''
    };

    var deleteState = {
      active: false,
      total: 0,
      done: 0
    };

    var saveState = {
      active: false,
      total: 0,
      done: 0
    };

    // ── Batched, persisted delete queue ──
    // Every delete (single or bulk) goes through here so rapid deletes can never
    // race each other. IDs are sent in batches to the server's deleteWords action,
    // which matches by stable ID and deletes bottom-up.
    var DEL_QUEUE_KEY = 'kv_pending_deletes';
    var _delQueue = safeJsonParse(ls(DEL_QUEUE_KEY), []);
    var _delRunning = false, _delBatchTimer = null, DEL_BATCH = 25;

    function _saveDelQueue() { lsSet(DEL_QUEUE_KEY, JSON.stringify(_delQueue)); }

    function enqueueDeletes(ids, tab) {
      tab = tab || CURRENT_USER || MAIN_USER;
      var added = 0;
      ids.forEach(function(id) {
        id = String(id || '').trim();
        if (!id) return;
        if (_delQueue.some(function(q) { return q.id === id && q.tab === tab; })) return;
        _delQueue.push({ id: id, tab: tab });
        added++;
      });
      if (!added) return;
      _saveDelQueue();
      if (!deleteState.active) {
        deleteState = { active: true, total: 0, done: 0 };
        _etaReset('del');
      }
      deleteState.total += added;
      updateDeleteProgress();
      // Short debounce so rapid single deletes coalesce into one request
      clearTimeout(_delBatchTimer);
      _delBatchTimer = setTimeout(runDeleteQueue, 400);
    }

    function _setDeleteTriggersDisabled(on) {
      document.querySelectorAll('.ba-del').forEach(function(b) { b.disabled = on; });
    }

    // Exponential backoff for transient network drops: 2s, 4s, 8s … capped at 60s.
    // Resets on the first successful batch.
    var _delRetries = 0;
    function _backoffMs(retries) { return Math.min(60000, 2000 * Math.pow(2, Math.min(retries, 5))); }

    function runDeleteQueue() {
      if (_delRunning) return;
      if (!_delQueue.length || !SCRIPT_URL) {
        if (deleteState.active && !_delQueue.length) {
          deleteState.active = false;
          _setDeleteTriggersDisabled(false);
          if (!saveState.active) setStatus('ok', allRows.length + ' words');
          if (deleteState.done) toast('✓ ' + deleteState.done + ' entr' + (deleteState.done === 1 ? 'y' : 'ies') + ' deleted from sheet', 'ok');
        }
        return;
      }
      _delRunning = true;
      _setDeleteTriggersDisabled(true);
      var tab = _delQueue[0].tab;
      var batch = _delQueue.filter(function(q) { return q.tab === tab; }).slice(0, DEL_BATCH);
      var ids = batch.map(function(q) { return q.id; });
      postToSheet({ action: 'deleteWords', user: tab, tab: tab, ids: JSON.stringify(ids) }).then(function(j) {
        if (j && j.success) return true;
        if (j && /Unknown action/.test(j.error || '')) {
          // Older server deployment: fall back to sequential single deletes (still serialized)
          return ids.reduce(function(p, id) {
            return p.then(function() {
              var u = new URL(SCRIPT_URL);
              u.searchParams.set('action', 'deleteWord');
              u.searchParams.set('tab', tab);
              u.searchParams.set('id', id);
              return fetch(u.toString()).catch(function() {});
            });
          }, Promise.resolve()).then(function() { return true; });
        }
        return false;
      }).then(function(okd) {
        _delRunning = false;
        if (okd) {
          _delRetries = 0;
          var sent = {};
          ids.forEach(function(id) { sent[id] = 1; });
          _delQueue = _delQueue.filter(function(q) { return !(q.tab === tab && sent[q.id]); });
          _saveDelQueue();
          deleteState.done += ids.length;
          updateDeleteProgress();
          setTimeout(runDeleteQueue, 150);
        } else {
          // Keep items queued; retry with exponential back-off
          _delRetries++;
          updateDeleteProgress();
          setTimeout(runDeleteQueue, _backoffMs(_delRetries));
        }
      });
    }

    // ── ETA helpers for the yellow status bar / progress overlay ──
    var _etaStarts = {};
    function _etaReset(key) { _etaStarts[key] = { t: Date.now(), d0: 0 }; }
    function _etaText(key, done, total) {
      var st = _etaStarts[key];
      if (!st || done <= 0 || total <= 0) { if (!st) _etaReset(key); return 'Estimating time remaining…'; }
      var remaining = Math.max(0, total - done);
      if (!remaining) return 'Almost done…';
      var perItem = (Date.now() - st.t) / done;
      var secs = Math.ceil(perItem * remaining / 1000);
      var txt = secs < 60 ? secs + 's' : Math.floor(secs / 60) + 'm ' + (secs % 60) + 's';
      return '⏱ ~' + txt + ' remaining (' + remaining + ' left)';
    }
    function _showEta(text) {
      var e2 = el('imp-eta');
      if (!e2) {
        var det = el('imp-detail');
        if (!det || !det.parentNode) return;
        e2 = document.createElement('div');
        e2.id = 'imp-eta';
        e2.className = 'imp-eta';
        det.parentNode.insertBefore(e2, det.nextSibling);
      }
      e2.textContent = text;
    }

    // ── Sync gate: block sync while mutating requests are in flight ──
    var _syncDeferred = false;
    function mutationsInFlight() {
      return !!(deleteState.active || _delQueue.length || importState.active || (saveState.active && queueRunning) ||
        activeTasks > 0 || (typeof _editQueue !== 'undefined' && _editQueue.length) || _importSubmitting);
    }
    setInterval(function() {
      if (_syncDeferred && !mutationsInFlight()) { _syncDeferred = false; loadData(true); }
    }, 3000);

    setTimeout(function() { if (_delQueue.length) { deleteState = { active: true, total: _delQueue.length, done: 0 }; _etaReset('del'); runDeleteQueue(); } }, 4000);

    var DEFAULT_CATS = ['Words', 'Sentences'];
    var S = {
      density: 'compact',
      highlight: true,
      autoSync: 0,
      studyDir: 'kh',
      studyRo: true,
      offlineMode: false,
      enFontSize: 14,
      enFont: "system-ui,-apple-system,'Segoe UI',sans-serif",
      khFontSize: 16,
      khFont: "'Noto Sans Khmer',system-ui,sans-serif",
      accent: 'purple',
      colEn: true,
      colKh: true,
      colRo: true,
      colNo: true,
      colCa: true,
      colDt: false,
      showRo: true,
      srs: true,
      match5: false,
      favBoost: false,
      defaultPage: 'add',
      tts: true,
      dailyWords: true,
      swipeStudy: true,
      hideDueTodayBanner: false,
      showBlurButtons: false,
      autoSpeakFlip: true,
      recentPerPage: 20
    };
    var ACCENT_PRESETS = {
      purple: {
        acc: '#6d31d4',
        acc2: '#9333ea',
        acc3: '#b06ef5'
      },
      blue: {
        acc: '#1840c2',
        acc2: '#2f72e8',
        acc3: '#7ab3f8'
      },
      teal: {
        acc: '#0d6660',
        acc2: '#0fa89a',
        acc3: '#4dd8c8'
      },
      green: {
        acc: '#105528',
        acc2: '#18a84e',
        acc3: '#6edc94'
      },
      rose: {
        acc: '#9c161f',
        acc2: '#c91d28',
        acc3: '#d8535c'
      },
      amber: {
        acc: '#7c350a',
        acc2: '#d98a08',
        acc3: '#f5cc60'
      },
      white: {
        acc: '#8899aa',
        acc2: '#c8d4df',
        acc3: '#f0f4f8'
      },
      black: {
        acc: '#080810',
        acc2: '#181824',
        acc3: '#383850'
      }
    };
    var MILESTONES_ADD = [{
      n: 1,
      icon: '🌱',
      name: 'First Word'
    }, {
      n: 10,
      icon: '📚',
      name: 'Bookworm'
    }, {
      n: 25,
      icon: '🔥',
      name: 'On Fire'
    }, {
      n: 50,
      icon: '💪',
      name: 'Commit'
    }, {
      n: 100,
      icon: '🎯',
      name: 'Century'
    }, {
      n: 250,
      icon: '🏆',
      name: 'Master'
    }, {
      n: 500,
      icon: '👑',
      name: 'Legend'
    }, {
      n: 1000,
      icon: '🌟',
      name: 'Transcend'
    }];
    var MILESTONES_STUDY = [{
      n: 1,
      icon: '🎯',
      name: '1st Study'
    }, {
      n: 10,
      icon: '📖',
      name: 'Student'
    }, {
      n: 25,
      icon: '🧠',
      name: 'Brain Pwr'
    }, {
      n: 50,
      icon: '⚡',
      name: 'Sparking'
    }, {
      n: 100,
      icon: '🔥',
      name: 'On Fire'
    }, {
      n: 250,
      icon: '🏅',
      name: 'Expert'
    }, {
      n: 500,
      icon: '💎',
      name: 'Diamond'
    }, {
      n: 1000,
      icon: '🌟',
      name: 'Legend'
    }];

    var MILESTONES_MASTER = [{
      n: 5,
      icon: '✨',
      name: '5 Mastered'
    }, {
      n: 20,
      icon: '🎖️',
      name: '20 Mastered'
    }, {
      n: 50,
      icon: '🥈',
      name: '50 Mastered'
    }, {
      n: 100,
      icon: '🥇',
      name: '100 Mastered'
    }, {
      n: 250,
      icon: '🏆',
      name: '250 Mastered'
    }, {
      n: 500,
      icon: '💎',
      name: '500 Mastered'
    }];

    var MILESTONES_STREAK = [{
      n: 3,
      icon: '🔔',
      name: '3 Days'
    }, {
      n: 7,
      icon: '📅',
      name: '1 Week'
    }, {
      n: 14,
      icon: '💪',
      name: '2 Weeks'
    }, {
      n: 30,
      icon: '🗓️',
      name: '1 Month'
    }, {
      n: 60,
      icon: '🏅',
      name: '2 Months'
    }, {
      n: 100,
      icon: '👑',
      name: '100 Days'
    }];

    var ACHIEVEMENTS = [{
        id: 'star_collector',
        icon: '⭐',
        name: 'Star Collector',
        hint: 'Some words deserve a little extra love — start collecting them.',
        secret: false,
        desc: 'Added 25 words to your favourites.'
      },
      {
        id: 'broad_learner',
        icon: '🌍',
        name: 'Broad Learner',
        hint: 'Don\'t stay in one lane — knowledge has many shapes.',
        secret: false,
        desc: 'Added words across 4 or more different categories.'
      },
      {
        id: 'organiser',
        icon: '🗂️',
        name: 'Organiser',
        hint: 'Structure and variety go hand in hand.',
        secret: false,
        desc: 'Created and used 5 or more different categories.'
      },
      {
        id: 'word_hoarder',
        icon: '🏦',
        name: 'Word Hoarder',
        hint: 'A truly large collection takes patience to build.',
        secret: false,
        desc: 'Added 500 or more words to your sheet.'
      },
      {
        id: 'reset_button',
        icon: '🔴',
        name: 'Reset Button',
        hint: 'Facing your weaknesses is how you get stronger.',
        secret: true,
        desc: 'Used "Study weak words again" after finishing a session.'
      },
      {
        id: 'daily_habit',
        icon: '🔔',
        name: 'Daily Habit',
        hint: 'Come back each day and something will grow...',
        secret: true,
        desc: 'Studied 3 days in a row.'
      },
      {
        id: 'comeback',
        icon: '🔄',
        name: 'Comeback',
        hint: 'What once stumped you may surprise you.',
        secret: true,
        desc: 'Promoted 20 words from Unknown to Got it.'
      },
      {
        id: 'tortoise',
        icon: '🐢',
        name: 'Tortoise',
        hint: 'Slow and steady wins the race.',
        secret: true,
        desc: 'Added at least one word every week for 4 weeks in a row.'
      },
      {
        id: 'explorer',
        icon: '🗺️',
        name: 'Explorer',
        hint: 'Other pages hold secrets worth discovering.',
        secret: true,
        desc: 'Completed a 20+ card study session on someone else\'s page.'
      },
      {
        id: 'burglar',
        icon: '🥷',
        name: 'Burglar',
        hint: '...you didn\'t hear this from us.',
        secret: true,
        desc: 'Quietly borrowed 10 or more words from another person\'s sheet.'
      },
      {
        id: 'marathon',
        icon: '🏃',
        name: 'Marathon',
        hint: 'One day at a time, for a whole month.',
        secret: false,
        desc: 'Studied 30 days in a row.'
      },
      {
        id: 'first_contact',
        icon: '👋',
        name: 'First Contact',
        hint: 'Every collection starts with a single word.',
        secret: false,
        desc: 'Added your first word.'
      },
      {
        id: 'early_bird',
        icon: '🌅',
        name: 'Early Bird',
        hint: 'The early learner catches the words.',
        secret: true,
        desc: 'Studied before 8am, 5 times.'
      },
      {
        id: 'night_owl',
        icon: '🦉',
        name: 'Night Owl',
        hint: 'Some people learn best when the world is asleep.',
        secret: true,
        desc: 'Studied after 10pm, 5 times.'
      },
      {
        id: 'customizer',
        icon: '🎨',
        name: 'Customizer',
        hint: 'Make it yours.',
        secret: false,
        desc: 'Changed the app theme or a setting.'
      },
      {
        id: 'actually_smart',
        icon: '🧠',
        name: 'Actually Smart',
        hint: 'Why type it all out by hand?',
        secret: true,
        desc: 'Imported words from a CSV file.'
      },
      {
        id: 'curious',
        icon: '🔍',
        name: 'Curious',
        hint: 'What\'s new? Go find out.',
        secret: true,
        desc: 'Opened the change log.'
      },
      {
        id: 'competitive',
        icon: '🏆',
        name: 'Competitive',
        hint: 'Aim for the top of the leaderboard.',
        secret: false,
        desc: 'Had the most words added by the weekly reset.'
      },
      {
        id: 'completionist',
        icon: '💯',
        name: 'Completionist',
        hint: 'One left to go...',
        secret: true,
        desc: 'Earned every other achievement.'
      }
    ];

    function todayKH() {
      var d = new Date(Date.now() + 7 * 3600000);
      var p = function(x) {
        return x < 10 ? '0' + x : String(x);
      };
      return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
    }

    function isoWeekKey() {
      var d = new Date(Date.now() + 7 * 3600000);
      var day = d.getUTCDay() || 7;
      var monday = new Date(d.getTime() - (day - 1) * 86400000);
      var p = function(x) {
        return x < 10 ? '0' + x : String(x);
      };
      return monday.getUTCFullYear() + '-' + p(monday.getUTCMonth() + 1) + '-' + p(monday.getUTCDate());
    }

    function trackWeeklyAdd() {
      var weeks = safeJsonParse(ls(WEEKLY_ADD_KEY), []);
      var wk = isoWeekKey();
      if (!weeks.length || weeks[weeks.length - 1] !== wk) {
        weeks.push(wk);
        if (weeks.length > 20) weeks = weeks.slice(-20);
        lsSet(WEEKLY_ADD_KEY, JSON.stringify(weeks));
      }
      checkAndUnlock('tortoise');
    }

    function unlockAchievement(id) {
      if (achievements[id] && achievements[id].unlocked) return false;
      achievements[id] = {
        unlocked: true,
        date: todayKH()
      };
      lsSet(ACHV_KEY, JSON.stringify(achievements));
      var a = ACHIEVEMENTS.filter(function(x) {
        return x.id === id;
      })[0];
      if (a) showAchievementToast(a);
      try { renderAchvShelf(); } catch (e) {}
      // persist the unlock to the sheet backup too (debounced inside)
      try { if (typeof saveUserDataToSheet === 'function') setTimeout(function() { saveUserDataToSheet(true); }, 1500); } catch (e) {}
      if (id !== 'completionist') checkAndUnlock('completionist');
      return true;
    }

    // Re-evaluate every state-based achievement (on launch / after restore) so nothing
    // that is already satisfied stays locked because its event fired before this build.
    function auditAchievements() {
      if (readOnlyMode) return;
      ['star_collector', 'broad_learner', 'organiser', 'word_hoarder', 'daily_habit', 'marathon', 'comeback', 'tortoise',
        'explorer', 'burglar', 'reset_button', 'early_bird', 'night_owl', 'competitive', 'completionist'
      ].forEach(function(id) { try { checkAndUnlock(id); } catch (e) {} });
    }

    function checkAndUnlock(id) {
      if (achievements[id] && achievements[id].unlocked) return;
      // Never award achievements from data of a sheet you are only viewing
      if (readOnlyMode && ['broad_learner', 'organiser', 'word_hoarder'].indexOf(id) !== -1) return;
      var unlock = false;
      if (id === 'star_collector') {
        unlock = favorites.size >= 25;
      } else if (id === 'broad_learner') {
        var cats1 = {};
        allRows.forEach(function(r) {
          getWordCategories(r).forEach(function(c) { cats1[c] = 1; });
        });
        unlock = Object.keys(cats1).length >= 4;
      } else if (id === 'organiser') {
        var cats2 = {};
        allRows.forEach(function(r) {
          getWordCategories(r).forEach(function(c) { cats2[c] = 1; });
        });
        unlock = Object.keys(cats2).length >= 5;
      } else if (id === 'daily_habit') {
        var sd = safeJsonParse(ls(STREAK_KEY), {
          count: 0
        });
        unlock = (sd.count || 0) >= 3;
      } else if (id === 'comeback') {
        unlock = (parseInt(ls(COMEBACK_KEY) || '0')) >= 20;
      } else if (id === 'tortoise') {


        var weeks = safeJsonParse(ls(WEEKLY_ADD_KEY), []);
        if (weeks.length >= 4) {
          var tail = weeks.slice(-4);
          var consec = true;
          for (var wi = 0; wi < 3; wi++) {
            var dA = new Date(tail[wi] + 'T00:00:00Z').getTime();
            var dB = new Date(tail[wi + 1] + 'T00:00:00Z').getTime();
            var diffDays = Math.round((dB - dA) / 86400000);
            if (isNaN(diffDays) || diffDays !== 7) {
              consec = false;
              break;
            }
          }
          unlock = consec;
        }
      } else if (id === 'explorer') {
        unlock = (parseInt(ls(EXPLORER_KEY) || '0')) >= 1;
      } else if (id === 'burglar') {
        unlock = (parseInt(ls(BURGLAR_KEY) || '0')) >= 10;
      } else if (id === 'word_hoarder') {
        unlock = allRows.length >= 500;
      } else if (id === 'reset_button') {
        unlock = (parseInt(ls('kv_reset_btn') || '0')) >= 1;
      } else if (id === 'marathon') {
        var sdM = safeJsonParse(ls(STREAK_KEY), {
          count: 0
        });
        unlock = (sdM.count || 0) >= 30;
      } else if (id === 'first_contact') {


        unlock = true;
      } else if (id === 'early_bird') {
        unlock = (parseInt(ls(EARLY_BIRD_KEY) || '0')) >= 5;
      } else if (id === 'night_owl') {
        unlock = (parseInt(ls(NIGHT_OWL_KEY) || '0')) >= 5;
      } else if (id === 'customizer') {


        unlock = true;
      } else if (id === 'actually_smart') {
        unlock = true;
      } else if (id === 'curious') {
        unlock = true;
      } else if (id === 'competitive') {
        unlock = (parseInt(ls(COMPETITIVE_KEY) || '0')) >= 1;
      } else if (id === 'completionist') {
        unlock = ACHIEVEMENTS.every(function(a) {
          return a.id === 'completionist' || (achievements[a.id] && achievements[a.id].unlocked);
        });
      }
      if (unlock) unlockAchievement(id);
    }

    function showAchievementToast(a) {
      var box = el('tbox');
      if (!box) return;
      var div = document.createElement('div');
      div.className = 'toast achv-toast';
      div.innerHTML = '<span class="achv-toast-icon">' + a.icon + '</span><span><strong>Achievement!</strong> ' + esc(a.name) + '</span>';
      box.appendChild(div);
      setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 5500);
    }

    function renderAchvShelf() {
      var shelf = el('achv-shelf');
      if (!shelf) return;
      shelf.innerHTML = '';
      var firstLocked = null;
      ACHIEVEMENTS.forEach(function(a) {
        var data = achievements[a.id];
        var unlocked = !!(data && data.unlocked);
        var card = document.createElement('div');
        card.className = 'ms-card achv-card' + (unlocked ? ' unlocked' : '');
        card.style.cursor = 'pointer';
        card.innerHTML = '<div class="ms-icon">' + a.icon + '</div>' +
          '<div class="ms-name">' + (a.secret && !unlocked ? '???' : esc(a.name)) + '</div>' +
          '<div class="ms-req">' + (unlocked ? '✓' : '🔒') + '</div>';
        (function(aRef, dataRef, unlockedRef) {
          card.onclick = function() {
            if (unlockedRef) {
              toast(aRef.icon + ' ' + aRef.name + ': ' + aRef.desc + (dataRef && dataRef.date ? ' (' + dataRef.date + ')' : ''), 'ok');
            } else {
              toast('\uD83D\uDCA1 ' + aRef.hint, 'inf');
            }
          };
        })(a, data, unlocked);
        shelf.appendChild(card);
        if (!unlocked && !firstLocked) firstLocked = card;
      });
      if (firstLocked) {
        setTimeout(function() {
          var cw = firstLocked.offsetWidth || 70;
          shelf.scrollLeft = Math.max(0, firstLocked.offsetLeft + cw - shelf.clientWidth + 6);
        }, 60);
      }
    }

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme || 'dark');
      var btn = el('theme-toggle-btn');
      if (btn) btn.textContent = (theme === 'light') ? '\uD83C\uDF19 Dark mode' : '\u2600\uFE0F Light mode';
      lsSet(THEME_KEY, theme || 'dark');
    }

    function toggleTheme() {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
      checkAndUnlock('customizer');
    }

    function ls(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    }

    function lsSet(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    }

    function safeJsonParse(s, d) {
      try {
        return s ? JSON.parse(s) : d;
      } catch (e) {
        return d;
      }
    }

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = String(s || '');
      return d.innerHTML;
    }

    function el(id) {
      return document.getElementById(id);
    }

    function applyColWidth(col, val) {
      val = parseInt(val);
      if (isNaN(val)) return;
      colWidths[col] = val;
      lsSet(COL_WIDTHS_KEY, JSON.stringify(colWidths));
      document.documentElement.style.setProperty('--col-w-' + col, val + 'px');
      var lbl = el('cw-' + col + '-lbl');
      if (lbl) lbl.textContent = val + 'px';
      var numEl = el('cw-' + col + '-num');
      if (numEl && document.activeElement !== numEl) numEl.value = val;
    }

    function loadColWidths() {
      ['en', 'kh', 'ro', 'no', 'ca'].forEach(function(c) {
        var locked = el('cw-' + c + '-lock');
        var sl = el('cw-' + c);
        var num = el('cw-' + c + '-num');
        var isLocked = locked ? locked.checked : true;
        if (sl) sl.disabled = isLocked;
        if (num) num.disabled = isLocked;
      });
      var defs = {
        en: 160,
        kh: 180,
        ro: 150,
        no: 170,
        ca: 110
      };
      Object.keys(defs).forEach(function(col) {
        var val = colWidths[col] || defs[col];
        document.documentElement.style.setProperty('--col-w-' + col, val + 'px');
        var sl = el('cw-' + col);
        if (sl) sl.value = val;
        var lb = el('cw-' + col + '-lbl');
        if (lb) lb.textContent = val + 'px';
      });
    }

    function resetColWidths() {
      if (!confirm('Reset all column widths to default?')) return;
      colWidths = {};
      lsSet(COL_WIDTHS_KEY, JSON.stringify(colWidths));
      ['en', 'kh', 'ro', 'no', 'ca'].forEach(function(c) {
        var lock = el('cw-' + c + '-lock');
        var sl = el('cw-' + c);
        var num = el('cw-' + c + '-num');
        if (lock) lock.checked = true;
        if (sl) sl.disabled = true;
        if (num) num.disabled = true;
      });
      loadColWidths();
      toast('Column widths reset.', 'ok');
    }

    function nowKH() {
      var d = new Date();
      var kh = new Date(d.getTime() + 7 * 3600000);
      var p = function(x) {
        return x < 10 ? '0' + x : String(x);
      };
      return kh.getUTCFullYear() + '-' + p(kh.getUTCMonth() + 1) + '-' + p(kh.getUTCDate()) + ' ' + p(kh.getUTCHours()) + ':' + p(kh.getUTCMinutes());
    }


    function parseKhDateMs(s) {
      if (!s) return NaN;
      var m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
      if (!m) return NaN;
      var KH_OFFSET = 7 * 3600000;
      return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - KH_OFFSET;
    }


    function currentWeekStartKH() {
      var KH_OFFSET = 7 * 3600000;
      var khNow = new Date(Date.now() + KH_OFFSET);
      var day = khNow.getUTCDay();
      var diffToMonday = (day + 6) % 7;
      var monday = new Date(Date.UTC(khNow.getUTCFullYear(), khNow.getUTCMonth(), khNow.getUTCDate() - diffToMonday, 17, 30, 0, 0));
      if (khNow.getTime() < monday.getTime()) {
        monday = new Date(monday.getTime() - 7 * 86400000);
      }
      return monday.getTime() - KH_OFFSET;
    }

    function hlText(s, q) {
      if (!q) return esc(s);
      var sl = s.toLowerCase(),
        idx = sl.indexOf(q);
      if (idx === -1) return esc(s);
      return esc(s.slice(0, idx)) + '<span class="hl">' + esc(s.slice(idx, idx + q.length)) + '</span>' + hlText(s.slice(idx + q.length), q);
    }

    function bCls(cat) {
      var m = {
        Words: 'bw',
        Sentences: 'bs',
        'Level 1': 'b1',
        'Level 2': 'b2',
        'Level 3': 'b3'
      };
      return m[cat] || 'bc';
    }

    function wordKey(r) {
      return (r.khmer || '') + '§' + (r.english || '') + '§' + (r.romanization || '');
    }

    function isFav(r) {
      return favorites.has(wordKey(r));
    }

    function saveFavorites() {
      lsSet(FAV_KEY, JSON.stringify(Array.from(favorites)));
      checkAndUnlock('star_collector');
    }

    function saveStudySets() {
      lsSet(SETS_KEY, JSON.stringify(studySets));
    }

    function saveCatOrder() {
      lsSet(CAT_ORDER_KEY, JSON.stringify(catOrder));
    }

    function initCatOrder() {
      var all = getAllCats();
      catOrder = catOrder.filter(function(c) {
        return all.indexOf(c) !== -1;
      });
      all.forEach(function(c) {
        if (catOrder.indexOf(c) === -1) catOrder.push(c);
      });
      saveCatOrder();
    }

    function moveCatItem(idx, dir) {
      initCatOrder();
      var newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= catOrder.length) return;
      var tmp = catOrder[idx];
      catOrder[idx] = catOrder[newIdx];
      catOrder[newIdx] = tmp;
      saveCatOrder();
      renderCustomCatList();
      refreshAllCatDropdowns();
    }

    function resetCatOrder() {
      catOrder = [];
      saveCatOrder();
      refreshAllCatDropdowns();
      renderCustomCatList();
      toast('Category order reset.', 'ok');
    }

    function saveCustomCats() {
      lsSet(CATS_KEY, JSON.stringify(customCats));
    }

    function savePendingQueue() {
      lsSet(QUEUE_KEY, JSON.stringify(pendingQueue));
    }

    // Multi-category normalizer. Legacy rows carry a single `category` string;
    // rows saved by 9.0.5 carry `categories[]` plus a ", "-joined `category` for the sheet.
    var getWordCategories = function(w) {
      if (!w) return ['Uncategorized'];
      if (Array.isArray(w.categories) && w.categories.length) return w.categories;
      var c = String(w.category || '').trim();
      if (!c) return ['Uncategorized'];
      return c.indexOf(', ') !== -1 ? c.split(', ').map(function(x) { return x.trim(); }).filter(Boolean) : [c];
    };
    function setWordCategories(w, cats) {
      cats = (cats || []).filter(function(c, i, a) { return c && a.indexOf(c) === i; });
      if (!cats.length) cats = ['Words'];
      w.categories = cats;
      w.category = cats.join(', ');
    }
    function catLabel(w) { return getWordCategories(w).join(', '); }
    function wordHasCat(w, c) { return getWordCategories(w).indexOf(c) !== -1; }

    function getAllCats() {
      var raw = DEFAULT_CATS.slice();
      customCats.forEach(function(c) {
        if (raw.indexOf(c) === -1) raw.push(c);
      });
      var cats;
      if (catOrder && catOrder.length) {
        cats = catOrder.filter(function(c) {
          return raw.indexOf(c) !== -1;
        });
        raw.forEach(function(c) {
          if (cats.indexOf(c) === -1) cats.push(c);
        });
      } else {
        cats = raw;
      }
      cats = cats.filter(function(c) {
        return deletedCats.indexOf(c) === -1;
      });
      if (readOnlyMode) {
        tempGuestCats.forEach(function(c) {
          if (cats.indexOf(c) === -1) cats.push(c);
        });
      }
      return cats;
    }

    async function fetchCredentials() {
      if (!SCRIPT_URL) return [];
      try {
        var resp = await fetch(SCRIPT_URL + '?action=getCredentials');
        var json = await resp.json();
        if (!json.success) return [];
        return json.credentials || [];
      } catch (e) {
        return [];
      }
    }

    async function verifyLogin(name, pass) {
      if (!SCRIPT_URL) return 'new_user';
      try {
        var url = new URL(SCRIPT_URL);
        url.searchParams.set('action', 'verifyCredential');
        url.searchParams.set('username', name);
        url.searchParams.set('password', pass);
        var resp = await fetch(url.toString());
        var json = await resp.json();
        if (!json.success) return 'new_user';
        return json.result;
      } catch (e) {
        return 'new_user';
      }
    }

    // Returns a promise so account creation is serialised (credential row first, then
    // getOrCreateUser). Firing both at once let the backend append the user twice.
    var _credRegisterInFlight = {};
    function registerUserCredentials(name, pass) {
      if (!SCRIPT_URL || !name || !pass) return Promise.resolve();
      var key = name.trim().toLowerCase();
      if (_credRegisterInFlight[key]) return _credRegisterInFlight[key];
      var url = new URL(SCRIPT_URL);
      url.searchParams.set('action', 'setCredential');
      url.searchParams.set('username', name);
      url.searchParams.set('password', pass);
      var p = fetch(url.toString()).catch(function() {}).then(function() {
        delete _credRegisterInFlight[key];
      });
      _credRegisterInFlight[key] = p;
      return p;
    }

    async function deleteCredentials(name) {
      if (!SCRIPT_URL || !name) return;
      try {
        var url = new URL(SCRIPT_URL);
        url.searchParams.set('action', 'deleteCredential');
        url.searchParams.set('username', name);
        await fetch(url.toString());
      } catch (e) {}
    }

    var _loginInFlight = false;
    async function handleLogin() {
      if (_loginInFlight) return;
      var name = (el('user-inp').value || '').trim();
      var pass = (el('user-pass').value || '').trim();
      var msgEl = el('user-login-msg');

      function showMsg(msg, isErr) {
        if (!msgEl) return;
        msgEl.textContent = msg;
        msgEl.style.display = msg ? 'block' : 'none';
        msgEl.style.background = isErr ? 'rgba(239,68,68,.12)' : 'rgba(34,197,94,.1)';
        msgEl.style.color = isErr ? 'var(--bad)' : 'var(--ok)';
        msgEl.style.border = '1px solid ' + (isErr ? 'rgba(239,68,68,.3)' : 'rgba(34,197,94,.25)');
      }
      if (!name) {
        showMsg('Please enter your name.', true);
        return;
      }
      if (!pass) {
        showMsg('Please enter a password.', true);
        return;
      }

      var btn = el('user-start-btn');
      if (btn) {
        btn.textContent = 'Checking…';
        btn.disabled = true;
      }

      if (!SCRIPT_URL) {
        MAIN_USER = name;
        CURRENT_USER = name;
        lsSet(MAINUSER_KEY, name);
        window._pendingPassword = pass;
        el('user-ovl').classList.remove('open');
        showMsg('', false);
        applyUserBadge();
        updateCfgUsername();
        if (btn) {
          btn.textContent = 'Log In →';
          btn.disabled = false;
        }
        el('user-step2-ovl').classList.add('open');
        return;
      }

      _loginInFlight = true;
      var result;
      try { result = await verifyLogin(name, pass); } finally { _loginInFlight = false; }
      if (btn) {
        btn.textContent = 'Log In →';
        btn.disabled = false;
      }

      if (result === 'ok') {
        MAIN_USER = name;
        CURRENT_USER = name;
        lsSet(MAINUSER_KEY, name);
        el('user-ovl').classList.remove('open');
        showMsg('', false);
        applyUserBadge();
        updateCfgUsername();
        toast('Welcome back, ' + name + '!', 'ok');
        onboardComplete(false);
      } else if (result === 'wrong_password') {
        showMsg('Password is incorrect.', true);
      } else if (result === 'wrong_name') {
        showMsg('Name is incorrect.', true);
      } else {
        if (confirm('No account found for "' + name + '". Create a new account?')) {
          MAIN_USER = name;
          CURRENT_USER = name;
          lsSet(MAINUSER_KEY, name);
          window._pendingPassword = pass;
          el('user-ovl').classList.remove('open');
          showMsg('', false);
          applyUserBadge();
          updateCfgUsername();
          el('user-step2-ovl').classList.add('open');
        }
      }
    }

    function logout() {
      if (!confirm('Log out? You will need to enter your name and password next time.')) return;
      performLogout();
    }

    function performLogout() {
      MAIN_USER = '';
      CURRENT_USER = '';
      lsSet(MAINUSER_KEY, '');
      readOnlyMode = false;
      document.body.classList.remove('read-only');
      allRows = [];
      render();
      renderFav();
      applyUserBadge();
      ['cfg-ovl', 'acct-quick-ovl'].forEach(function(id) {
        var e = el(id);
        if (e) e.classList.remove('open');
      });
      el('user-ovl').classList.add('open');
      setStatus('off', 'Not signed in');
      setTimeout(function() {
        var ui = el('user-inp');
        if (ui) {
          ui.value = '';
          ui.focus();
        }
        var up = el('user-pass');
        if (up) up.value = '';
        var msg = el('user-login-msg');
        if (msg) msg.style.display = 'none';
      }, 50);
    }

    async function changeUsername() {
      var oldPass = ((el('cfg-change-pass-for-name') || {}).value || '').trim();
      var newName = ((el('cfg-new-username') || {}).value || '').trim();
      if (!oldPass || !newName) {
        toast('Fill in all fields.', 'err');
        return;
      }
      if (!MAIN_USER) {
        toast('Not logged in.', 'err');
        return;
      }
      if (newName === MAIN_USER) {
        toast('New name is the same as current name.', 'inf');
        return;
      }
      var result = await verifyLogin(MAIN_USER, oldPass);
      if (result !== 'ok') {
        toast('Current password is incorrect.', 'err');
        return;
      }
      await deleteCredentials(MAIN_USER);
      registerUserCredentials(newName, oldPass);
      var oldName = MAIN_USER;
      MAIN_USER = newName;
      CURRENT_USER = newName;
      lsSet(MAINUSER_KEY, newName);
      applyUserBadge();
      updateCfgUsername();
      if (el('cfg-change-pass-for-name')) el('cfg-change-pass-for-name').value = '';
      if (el('cfg-new-username')) el('cfg-new-username').value = '';
      toast('Username changed to "' + newName + '". Re-sync recommended.', 'ok');
      if (SCRIPT_URL) loadData();
    }

    async function changePassword() {
      var oldPass = ((el('cfg-old-password') || {}).value || '').trim();
      var newPass = ((el('cfg-new-password') || {}).value || '').trim();
      if (!oldPass || !newPass) {
        toast('Fill in all fields.', 'err');
        return;
      }
      if (!MAIN_USER) {
        toast('Not logged in.', 'err');
        return;
      }
      if (newPass === oldPass) {
        toast('New password is the same as current.', 'inf');
        return;
      }
      var result = await verifyLogin(MAIN_USER, oldPass);
      if (result !== 'ok') {
        toast('Current password is incorrect.', 'err');
        return;
      }
      await deleteCredentials(MAIN_USER);
      registerUserCredentials(MAIN_USER, newPass);
      if (el('cfg-old-password')) el('cfg-old-password').value = '';
      if (el('cfg-new-password')) el('cfg-new-password').value = '';
      toast('Password changed successfully.', 'ok');
    }

    function updateCfgUsername() {
      var e2 = el('cfg-uname');
      if (e2) e2.textContent = MAIN_USER || '—';
    }

    function renderDeviceInfo() {
      updateCfgUsername();
    }

    function setBusy(delta) {
      activeTasks = Math.max(0, activeTasks + delta);
      updateSyncBtn();
    }

    function updateSyncBtn() {
      var sb = el('sync-btn');
      if (!sb) return;
      var canSync = !!SCRIPT_URL && activeTasks === 0 && !readOnlyMode && !(S && S.offlineMode);
      sb.disabled = !canSync;
      sb.title = !SCRIPT_URL ? 'Connect your sheet in ⚙️ Settings first' :
        readOnlyMode ? 'Viewing read-only — return to your account to sync' :
        (S && S.offlineMode) ? 'Offline mode is on — disable it to sync' :
        activeTasks > 0 ? 'Busy — wait for current action to finish' : 'Sync now';
    }

    function doSyncClick() {
      if (mutationsInFlight()) {
        _syncDeferred = true;
        toast('Changes are still saving — sync will run right after.', 'inf');
        return;
      }
      if (activeTasks > 0) {
        toast('Please wait for the current action to finish first.', 'inf');
        return;
      }
      loadData(true);
    }

    var _ttsOffToastAt = 0;
    function ttsEnabled() {
      if (S.tts !== false) return true;
      if (Date.now() - _ttsOffToastAt > 4000) {
        _ttsOffToastAt = Date.now();
        toast('🔇 Text-to-speech is off (Settings → Audio).', 'inf');
      }
      return false;
    }

    // Audio generation token: bumped by stopAllAudio() so late callbacks from a
    // previous card's Audio()/fallback timer can never speak over the new card.
    var _audioGen = 0, _audioTimers = [];

    function stopAllAudio() {
      _audioGen++;
      _audioTimers.forEach(function(t) { clearTimeout(t); });
      _audioTimers = [];
      try {
        if (ttsAudio) { ttsAudio.pause(); ttsAudio.removeAttribute('src'); ttsAudio.load(); }
      } catch (e) {}
      ttsAudio = null;
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    }

    function speakKhmer(text) {
      if (!ttsEnabled()) return;
      text = (text || '').trim();
      if (!text) {
        toast('No Khmer text to speak.', 'inf');
        return;
      }
      stopAllAudio();
      var gen = _audioGen, done = false;
      var src = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(text) + '&tl=km&client=tw-ob&ttsspeed=0.9';
      var audio = new Audio(src);
      function fallback() {
        if (done || gen !== _audioGen) return;
        done = true;
        clearTimeout(ttsTimeout);
        try { audio.pause(); } catch (e) {}
        tryWebSpeech(text, 'km-KH');
      }
      var ttsTimeout = setTimeout(fallback, 5000);
      _audioTimers.push(ttsTimeout);
      audio.addEventListener('canplay', function() {
        clearTimeout(ttsTimeout);
      });
      audio.addEventListener('error', fallback);
      ttsAudio = audio;
      audio.play().catch(fallback);
    }

    function speakEnglish(text) {
      if (!ttsEnabled()) return;
      text = (text || '').trim();
      if (!text) return;
      tryWebSpeech(text, 'en-US');
    }

    function tryWebSpeech(text, lang) {
      if (S.tts === false) return;
      if (!('speechSynthesis' in window)) {
        toast('TTS not supported.', 'err');
        return;
      }
      window.speechSynthesis.cancel();
      var utt = new SpeechSynthesisUtterance(text);
      utt.lang = lang;
      window.speechSynthesis.speak(utt);
    }

    function speakCurrentCard() {
      var r = studyDeck[studyIdx];
      if (r) speakKhmer(r.khmer || '');
    }

    function setStatus(state, msg) {
      var sp = el('spill'),
        dot = el('dot'),
        stxt = el('stxt');
      if (!sp) return;
      dot.className = 'dot' + (state ? ' ' + state : '');
      stxt.textContent = msg || '';
      sp.className = 'spill' + (state === 'spin-dot' ? ' syncing' : state === 'ok' ? ' s-ok' : state === 'err' ? ' s-err' : state === 'off' ? ' s-off' : state === 'imp' ? ' s-imp' : '');
    }

    function onSpillClick() {
      if (importState.active || deleteState.active || saveState.active) {
        if (importState.active) updateImportProgress();
        else if (deleteState.active) updateDeleteProgress();
        else updateSaveProgress();
        el('imp-prog-ovl').classList.add('open');
      } else if (_syncInFlight) {
        _showEta('⏱ Syncing — usually finishes in a few seconds');
        toast('Syncing with your sheet — usually a few seconds.', 'inf');
      } else if (_syncDeferred) {
        toast('Sync will run as soon as the current changes finish saving.', 'inf');
      }
    }

    function updateImportProgress() {
      var pct = importState.total ? Math.round(importState.sent / importState.total * 100) : 0;
      var lb = el('imp-label'),
        pc = el('imp-pct'),
        bar = el('imp-bar'),
        det = el('imp-detail'),
        ttl = el('imp-prog-title');
      if (ttl) ttl.textContent = '📥 Import Progress';
      if (lb) lb.textContent = importState.label || 'Importing…';
      if (pc) pc.textContent = pct + '%';
      if (bar) bar.style.width = pct + '%';
      if (det) det.textContent = importState.sent + '/' + importState.total + ' words' + (importState.failed ? ' (' + importState.failed + ' failed)' : '');
      _showEta(_etaText('imp', importState.sent + importState.failed, importState.total));
      setStatus('imp', 'Importing ' + importState.sent + '/' + importState.total + '…');
    }

    function updateDeleteProgress() {
      var pct = deleteState.total ? Math.round(deleteState.done / deleteState.total * 100) : 0;
      var lb = el('imp-label'),
        pc = el('imp-pct'),
        bar = el('imp-bar'),
        det = el('imp-detail'),
        ttl = el('imp-prog-title');
      if (ttl) ttl.textContent = saveState.active ? '🗑️ Delete + 💾 Save' : '🗑️ Delete Progress';
      if (lb) lb.textContent = 'Deleting from sheet…';
      if (pc) pc.textContent = pct + '%';
      if (bar) bar.style.width = pct + '%';
      if (det) det.textContent = deleteState.done + '/' + deleteState.total + ' word' + (deleteState.total !== 1 ? 's' : '') + ' deleted';
      _showEta(_etaText('del', deleteState.done, deleteState.total));
      var deleteRemaining = deleteState.active ? deleteState.total - deleteState.done : 0;
      var totalTasks = deleteRemaining + (saveState.active ? saveState.total - saveState.done : 0);
      if (totalTasks > 0) setStatus('imp', deleteRemaining + ' word' + (deleteRemaining !== 1 ? 's' : '') + ' deleting…');
    }

    function triggerSaveState() {
      if (!saveState.active) {
        saveState.done = 0;
        saveState.total = pendingQueue.length;
        saveState.active = true;
        _etaReset('save');
      } else {
        saveState.total = saveState.done + pendingQueue.length;
      }
      updateSaveProgress();
    }

    function cancelPendingUpload() {
      if (!confirm('Cancel remaining word uploads to the sheet? The remaining queued words will be removed.')) return;
      var count = pendingQueue.length;
      queueRunning = false;
      saveState.active = false;
      pendingQueue = [];
      savePendingQueue();
      var sec2 = el('imp-bar-section-2');
      if (sec2) sec2.style.display = 'none';
      el('imp-prog-ovl').classList.remove('open');
      setStatus('ok', allRows.length + ' words');
      toast('Upload cancelled (' + count + ' word' + (count !== 1 ? 's' : '') + ' removed from queue).', 'inf');
    }

    function updateSaveProgress() {
      var pct = saveState.total ? Math.round(saveState.done / saveState.total * 100) : 0;
      var remaining = Math.max(0, saveState.total - saveState.done);
      // Measured ETA (time per word so far × words left) instead of a fixed guess
      var timeEst = remaining > 0 ? (' · ' + _etaText('save', saveState.done, saveState.total)) : '';
      var label = 'Saving to sheet…' + (remaining > 0 ? ' (' + remaining + ' left)' : '');
      var detail = saveState.done + '/' + saveState.total + ' saved' + timeEst;
      var hasOther = importState.active || deleteState.active;
      var sec2 = el('imp-bar-section-2');
      if (hasOther) {
        var lb2 = el('save-label'),
          pc2 = el('save-pct'),
          bar2 = el('save-bar'),
          det2 = el('save-detail');
        if (lb2) lb2.textContent = label;
        if (pc2) pc2.textContent = pct + '%';
        if (bar2) bar2.style.width = pct + '%';
        if (det2) det2.textContent = detail;
        if (sec2) sec2.style.display = saveState.active ? 'block' : 'none';
      } else {
        var lb = el('imp-label'),
          pc = el('imp-pct'),
          bar = el('imp-bar'),
          det = el('imp-detail'),
          ttl = el('imp-prog-title');
        if (ttl) ttl.textContent = '💾 Saving Progress';
        if (lb) lb.textContent = label;
        if (pc) pc.textContent = pct + '%';
        if (bar) bar.style.width = pct + '%';
        if (det) det.textContent = detail;
        if (sec2) sec2.style.display = 'none';
        var remaining = saveState.total - saveState.done;
        setStatus('imp', remaining + ' word' + (remaining !== 1 ? 's' : '') + ' saving…');
      }
    }

    function populateCatDropdown(id, includeSpecial, currentVal) {
      var sel = el(id);
      if (!sel) return;
      var val = currentVal !== undefined ? currentVal : (sel.value || '');
      sel.innerHTML = '';
      if (includeSpecial) {
        addOpt(sel, 'All', 'All Categories');
        addOpt(sel, '__nosent__', 'All (except Sentences)');
      }
      getAllCats().forEach(function(c) {
        addOpt(sel, c, c);
      });
      if (includeSpecial) {
        addOpt(sel, '__fav__', '⭐ Favourites');
      }
      sel.value = val;
    }

    function addOpt(sel, val, txt) {
      var opt = document.createElement('option');
      opt.value = val;
      opt.textContent = txt;
      sel.appendChild(opt);
    }

    function getStudyFilterValues() {
      var sel = el('study-filter');
      if (!sel) return ['All'];
      var out = [];
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].selected) out.push(sel.options[i].value);
      }
      if (!out.length) out = ['All'];
      return out;
    }

    function setStudyFilterValues(vals) {
      var sel = el('study-filter');
      if (!sel) return;
      var want = (vals && vals.length) ? vals : ['All'];
      var any = false;
      for (var i = 0; i < sel.options.length; i++) {
        var on = want.indexOf(sel.options[i].value) !== -1;
        sel.options[i].selected = on;
        if (on) any = true;
      }
      if (!any && sel.options.length) sel.options[0].selected = true;
    }

    function populateStudyFilter() {
      var sel = el('study-filter');
      if (!sel) return;
      var prev = getStudyFilterValues();
      sel.innerHTML = '';
      addOpt(sel, 'All', 'All Words');
      addOpt(sel, '__nosent__', 'All (except Sentences)');
      getAllCats().forEach(function(c) {
        addOpt(sel, c, c);
      });
      addOpt(sel, '__fav__', '⭐ Favourites only');
      setStudyFilterValues(prev);
    }

    function populateStudyPresetFilter() {
      var sel = el('study-preset-filter');
      if (!sel) return;
      var val = sel.value || 'none';
      sel.innerHTML = '';
      addOpt(sel, 'none', '— No preset —');
      addOpt(sel, '__weak__', '🔴 Weak words only');
      addOpt(sel, '__due__', '🔁 SRS Due today');
      addOpt(sel, '__duetoday__', '📅 Due Today (reviews only)');
      addOpt(sel, '__cons__', '🔤 Consonants');
      addOpt(sel, '__depvow__', '🔡 Dep. Vowels');
      addOpt(sel, '__indvow__', '🔠 Ind. Vowels');
      addOpt(sel, '__nums__', '🔢 Numbers (0–100)');
      var setsToUse = (typeof studySets !== 'undefined' ? studySets : (window.studySets || []));
      if (setsToUse && setsToUse.length > 0) {
        setsToUse.forEach(function(st) {
          addOpt(sel, 'set:' + st.id, '📁 Set: ' + st.name);
        });
      }
      sel.value = val;
    }

    function onStudyCatChange(which) {
      var userSel = el('study-filter');
      var presetSel = el('study-preset-filter');
      if (!userSel || !presetSel) return;
      if (which === 'user') {
        presetSel.value = 'none';
        userSel.classList.add('active-sel');
        presetSel.classList.remove('active-sel');
      } else {
        if (presetSel.value === 'none') {
          userSel.classList.add('active-sel');
          presetSel.classList.remove('active-sel');
        } else {
          setStudyFilterValues(['All']);
          presetSel.classList.add('active-sel');
          userSel.classList.remove('active-sel');
        }
      }
    }

    function refreshAllCatDropdowns() {
      var vcf = el('view-conf-filter');
      if (vcf && ls('kv_view_conf')) vcf.value = ls('kv_view_conf');
      var vc = (el('view-cat-filter') || {}).value || ls('kv_view_cat') || 'All',
        fc = (el('f-cat') || {}).value || 'Words',
        bc = (el('bulkcat-sel') || {}).value || 'Words';
      populateCatDropdown('view-cat-filter', true, vc);
      populateCatDropdown('f-cat', false, fc);
      renderEditCatPicker(_editCats);
      populateCatDropdown('bulkcat-sel', false, bc);
      populateStudyFilter();
      populateStudyPresetFilter();
    }

    function openNewCatModal() {
      var inp = el('newcat-inp');
      if (inp) inp.value = '';
      renderCustomCatList();
      el('newcat-ovl').classList.add('open');
      setTimeout(function() {
        if (inp) inp.focus();
      }, 100);
    }

    // Commas separate multiple categories in the sheet's single category cell,
    // so a comma inside a category name would split it into two categories.
    function catNameHasComma(name) {
      if (/[,，、]/.test(name)) {
        toast("Category names can't contain a comma (,). Please remove it.", 'err');
        return true;
      }
      return false;
    }

    function addCustomCat() {
      var name = (el('newcat-inp').value || '').trim();
      if (!name) {
        toast('Enter a category name.', 'err');
        return;
      }
      if (catNameHasComma(name)) return;
      if (getAllCats().indexOf(name) !== -1) {
        toast('"' + name + '" already exists.', 'inf');
        return;
      }
      customCats.unshift(name);
      saveCustomCats();
      refreshAllCatDropdowns();
      renderCustomCatList();
      el('newcat-inp').value = '';
      syncCategoryToSheet('add', name);
      toast('Category "' + name + '" added.', 'ok');
    }

    function removeCustomCat(name) {
      if (!confirm('Delete category "' + name + '"?')) return;
      customCats = customCats.filter(function(c) {
        return c !== name;
      });
      saveCustomCats();
      refreshAllCatDropdowns();
      renderCustomCatList();
      syncCategoryToSheet('delete', name);
      toast('Category deleted.', 'ok');
    }

    function startEditCat(name) {
      renderCustomCatList(name);
    }

    function finishEditCat(oldName) {
      var safe = oldName.replace(/[^a-z0-9]/gi, '_'),
        inp = el('cat-edit-inp-' + safe);
      if (!inp) return;
      var newName = (inp.value || '').trim();
      if (!newName || newName === oldName) {
        renderCustomCatList();
        return;
      }
      if (catNameHasComma(newName)) { inp.focus(); return; }
      var idx = customCats.indexOf(oldName);
      if (idx !== -1) customCats[idx] = newName;
      allRows.forEach(function(r) {
        if (wordHasCat(r, oldName)) setWordCategories(r, getWordCategories(r).map(function(c) { return c === oldName ? newName : c; }));
      });
      saveCustomCats();
      saveCache(allRows);
      renderCustomCatList();
      refreshAllCatDropdowns();
      render();
      renderFav();
      toast('Renamed to "' + newName + '"', 'ok');
      syncCategoryToSheet('rename', oldName, newName);
    }

    function renderCustomCatList(editingName) {
      var box = el('custom-cat-list');
      if (!box) return;
      box.innerHTML = '';
      var PROTECTED = ['Words', 'Sentences'];
      var allCatsToShow = getAllCats();
      if (!allCatsToShow.length) {
        box.innerHTML = '<div style="font-size:.75rem;color:var(--dim);padding:8px">No categories yet.</div>';
        return;
      }
      allCatsToShow.forEach(function(c) {
        var safe = c.replace(/[^a-z0-9]/gi, '_'),
          row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:7px 10px;background:var(--surf2);border:1px solid var(--bdr);border-radius:10px';
        var isProtected = PROTECTED.indexOf(c) !== -1;
        if (editingName === c && !isProtected) {
          row.innerHTML = '<input id="cat-edit-inp-' + safe + '" style="flex:1;height:30px;background:var(--bg);border:1px solid var(--acc2);border-radius:6px;color:var(--text);padding:0 8px;font-size:.8rem;outline:none" value="' + esc(c) + '"/>' +
            '<button class="btn-s" style="padding:5px 10px;font-size:.75rem" onclick="finishEditCat(\'' + c.replace(/'/g, "\\'") + '\')" >✓</button>' +
            '<button class="btn-g" style="padding:5px 8px;font-size:.75rem" onclick="renderCustomCatList()">✕</button>';
        } else {
          var ci = allCatsToShow.indexOf(c);
          var _q = c.replace(/'/g, "\\'");
          row.innerHTML = '<span style="flex:1;min-width:0;font-size:.82rem;color:var(--text);overflow-wrap:break-word">' + esc(c) + (isProtected ? ' <span style="font-size:.65rem;color:var(--dim)">(protected)</span>' : '') + '</span>' +
            (isProtected ? '' : '<button class="custom-cat-edit" onclick="startEditCat(\'' + _q + '\')" title="Rename">✏️</button>') +
            (isProtected ? '' : '<button class="custom-cat-del" onclick="removeCatAny(\'' + _q + '\')" title="Delete">✕</button>') +
            '<span class="cat-move-grp"><button type="button" class="cat-move-btn" onclick="moveCatItem(' + ci + ',-1)" ' + (ci === 0 ? 'disabled' : '') + ' title="Move up">↑</button>' +
            '<button type="button" class="cat-move-btn" onclick="moveCatItem(' + ci + ',1)" ' + (ci === allCatsToShow.length - 1 ? 'disabled' : '') + ' title="Move down">↓</button></span>';
        }
        box.appendChild(row);
      });
    }

    function removeCatAny(name) {
      var PROTECTED = ['Words', 'Sentences'];
      if (PROTECTED.indexOf(name) !== -1) {
        toast('Cannot delete protected category.', 'err');
        return;
      }
      if (!confirm('⚠️ Delete category "' + name + '"?\n\nThis will permanently remove the category and move all words in it to "Words". This cannot be undone.')) return;
      if (deletedCats.indexOf(name) === -1) {
        deletedCats.push(name);
        lsSet(DELETED_CATS_KEY, JSON.stringify(deletedCats));
      }
      customCats = customCats.filter(function(c) {
        return c !== name;
      });
      DEFAULT_CATS = DEFAULT_CATS.filter(function(c) {
        return c !== name;
      });
      allRows.forEach(function(r) {
        if (wordHasCat(r, name)) setWordCategories(r, getWordCategories(r).filter(function(c) { return c !== name; }));
      });
      saveCustomCats();
      saveCache(allRows);
      refreshAllCatDropdowns();
      renderCustomCatList();
      render();
      renderFav();
      syncCategoryToSheet('delete', name);
      toast('Category "' + name + '" deleted. Words moved to "Words".', 'ok');
    }

    function syncCategoryToSheet(action, name, newName) {
      if (!SCRIPT_URL) return Promise.resolve();
      var url = new URL(SCRIPT_URL);
      url.searchParams.set('action', 'manageCategory');
      url.searchParams.set('op', action);
      url.searchParams.set('name', name);
      if (newName) url.searchParams.set('newName', newName);
      url.searchParams.set('user', MAIN_USER);
      return fetch(url.toString()).then(function(r) {
        return r.json();
      }).then(function(j) {
        if (j.success && Array.isArray(j.categories)) {
          applyCategoriesFromSheet(j.categories);
        }
      }).catch(function() {});
    }

    function applyCategoriesFromSheet(sheetCats) {
      customCats = sheetCats.filter(function(c) {
        return DEFAULT_CATS.indexOf(c) === -1;
      });
      deletedCats = [];
      lsSet(DELETED_CATS_KEY, '[]');
      saveCustomCats();
      refreshAllCatDropdowns();
      renderCustomCatList();
    }

    function loadCategoriesFromSheet() {
      if (!SCRIPT_URL || !MAIN_USER) return;
      fetch(SCRIPT_URL + '?action=getCategories&user=' + encodeURIComponent(MAIN_USER))
        .then(function(r) {
          return r.json();
        })
        .then(function(j) {
          if (j.success && Array.isArray(j.categories)) {
            applyCategoriesFromSheet(j.categories);
          }
        }).catch(function() {});
    }

    var DEFAULT_TAB_ORDER = ['view', 'add', 'trans', 'study', 'progress', 'ref', 'dash', 'notebook'];
    var TAB_ORDER_KEY = 'kv_tab_order';
    var tabOrder = safeJsonParse(ls(TAB_ORDER_KEY), null) || DEFAULT_TAB_ORDER.slice();
    // Saved orders from before 9.0.5 don't know about new tabs: append them at the end.
    DEFAULT_TAB_ORDER.forEach(function(id) { if (tabOrder.indexOf(id) === -1) tabOrder.push(id); });

    var HIDDEN_TABS_KEY = 'kv_hidden_tabs';
    var hiddenTabs = safeJsonParse(ls(HIDDEN_TABS_KEY), []) || [];

    function isTabHidden(id) {
      return hiddenTabs.indexOf(id) !== -1;
    }

    function visibleTabs() {
      return tabOrder.filter(function(id) {
        return !isTabHidden(id);
      });
    }

    function applyHiddenTabs() {
      DEFAULT_TAB_ORDER.forEach(function(id) {
        var btn = el('nav-' + id);
        if (btn) btn.style.display = isTabHidden(id) ? 'none' : '';
      });
      var activeBtn = document.querySelector('.nav button.active');
      if (activeBtn && activeBtn.style.display === 'none') {
        var first = visibleTabs()[0];
        if (first) goPage(first, 'nav-' + first);
      }
    }

    function buildTabVisibleList() {
      var box = el('tab-visible-list');
      if (!box) return;
      box.innerHTML = '';
      tabOrder.forEach(function(id) {
        var navBtn = el('nav-' + id);
        var label = navBtn ? navBtn.textContent.trim() : id;
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--surf2);border:1px solid var(--bdr);border-radius:8px';
        var span = document.createElement('span');
        span.style.cssText = 'flex:1;font-size:.82rem';
        span.textContent = label;
        row.appendChild(span);
        var lab = document.createElement('label');
        lab.className = 'tog';
        var cbx = document.createElement('input');
        cbx.type = 'checkbox';
        cbx.checked = !isTabHidden(id);
        (function(tid, box2) {
          cbx.addEventListener('change', function() {
            toggleTabVisible(tid, box2.checked);
          });
        })(id, cbx);
        var sl = document.createElement('span');
        sl.className = 'tog-sl';
        lab.appendChild(cbx);
        lab.appendChild(sl);
        row.appendChild(lab);
        box.appendChild(row);
      });
    }

    function toggleTabVisible(id, visible) {
      var i = hiddenTabs.indexOf(id);
      if (visible) {
        if (i !== -1) hiddenTabs.splice(i, 1);
      } else if (i === -1) {
        if (visibleTabs().length <= 1) {
          toast('Keep at least one tab visible.', 'err');
          buildTabVisibleList();
          return;
        }
        hiddenTabs.push(id);
      }
      lsSet(HIDDEN_TABS_KEY, JSON.stringify(hiddenTabs));
      applyHiddenTabs();
      buildTabVisibleList();
    }

    function resetHiddenTabs() {
      hiddenTabs = [];
      lsSet(HIDDEN_TABS_KEY, '[]');
      applyHiddenTabs();
      buildTabVisibleList();
      toast('All tabs visible.', 'ok');
    }

    function safeDefaultPage() {
      var dp = S.defaultPage || 'add';
      if (isTabHidden(dp)) dp = visibleTabs()[0] || dp;
      return dp;
    }

    function applyTabOrder() {
      var nav = document.querySelector('.nav');
      if (!nav) return;
      tabOrder.forEach(function(id) {
        var btn = el('nav-' + id);
        if (btn) nav.appendChild(btn);
      });
    }

    function buildTabOrderList() {
      var box = el('tab-order-list');
      if (!box) return;
      box.innerHTML = '';
      tabOrder.forEach(function(id, idx) {
        var btn = el('nav-' + id);
        var label = btn ? btn.textContent.trim() : id;
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--surf2);border:1px solid var(--bdr);border-radius:8px';
        row.innerHTML = '<span style="flex:1;font-size:.82rem">' + esc(label) + '</span>' +
          '<button class="btn-g" style="padding:4px 9px;font-size:.75rem" onclick="moveTab(' + idx + ',-1)" ' + (idx === 0 ? 'disabled' : '') + '>↑</button>' +
          '<button class="btn-g" style="padding:4px 9px;font-size:.75rem" onclick="moveTab(' + idx + ',1)" ' + (idx === tabOrder.length - 1 ? 'disabled' : '') + '>↓</button>';
        box.appendChild(row);
      });
    }

    function moveTab(idx, dir) {
      var newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= tabOrder.length) return;
      var tmp = tabOrder[idx];
      tabOrder[idx] = tabOrder[newIdx];
      tabOrder[newIdx] = tmp;
      lsSet(TAB_ORDER_KEY, JSON.stringify(tabOrder));
      applyTabOrder();
      buildTabOrderList();
    }

    function resetTabOrder() {
      if (!confirm('Reset tab order to default?')) return;
      tabOrder = DEFAULT_TAB_ORDER.slice();
      lsSet(TAB_ORDER_KEY, JSON.stringify(tabOrder));
      applyTabOrder();
      buildTabOrderList();
      toast('Tab order reset.', 'ok');
    }

    function openStudySetModal() {
      toast("Study sets removed.", "inf");
    }

    function renderStudySetList() {}

    function createAndAddSet() {
      var name = (el('sset-new-name').value || '').trim();
      if (!name) {
        toast('Enter a set name.', 'err');
        return;
      }
      var id = 'set_' + Date.now();
      studySets.unshift({
        id: id,
        name: name,
        keys: []
      });
      saveStudySets();
      addToSet(id);
    }

    function addToSet(id) {
      var s = studySets.find(function(s) {
        return s.id === id;
      });
      if (!s) return;
      var added = 0;
      selectedKeys.forEach(function(k) {
        if (s.keys.indexOf(k) === -1) {
          s.keys.push(k);
          added++;
        }
      });
      saveStudySets();

      populateStudyFilter();
      toast('Added ' + added + ' words to "' + s.name + '"', 'ok');
      exitBulk();
    }

    function loadSettings() {
      try {
        var r = ls(SKEY);
        if (r) Object.assign(S, safeJsonParse(r, {}));
      } catch (e) {}

      function g(id) {
        return el(id);
      }
      if (g('opt-density')) g('opt-density').value = S.density;
      if (g('opt-highlight')) g('opt-highlight').checked = S.highlight;
      if (g('opt-studydir')) g('opt-studydir').value = S.studyDir;
      if (g('opt-studyro')) g('opt-studyro').checked = S.studyRo;
      if (g('opt-offline')) g('opt-offline').checked = S.offlineMode;
      if (g('opt-enfontsize')) g('opt-enfontsize').value = S.enFontSize;
      if (g('opt-khfontsize')) g('opt-khfontsize').value = S.khFontSize;
      if (g('opt-khfont')) g('opt-khfont').value = S.khFont;
      if (g('opt-enfont')) g('opt-enfont').value = S.enFont || "system-ui,-apple-system,'Segoe UI',sans-serif";
      if (g('opt-showro')) g('opt-showro').checked = S.showRo;
      if (g('opt-srs')) g('opt-srs').checked = S.srs !== false;
      if (g('opt-mc')) g('opt-mc').checked = !!S.mc;
      if (g('opt-match5')) g('opt-match5').checked = !!S.match5;
      if (g('opt-favboost')) g('opt-favboost').checked = !!S.favBoost;
      if (g('opt-default-page')) g('opt-default-page').value = S.defaultPage || 'add';
      if (g('col-en')) g('col-en').checked = S.colEn !== false;
      if (g('col-kh')) g('col-kh').checked = S.colKh !== false;
      if (g('col-ro')) g('col-ro').checked = S.colRo !== false;
      if (g('col-no')) g('col-no').checked = S.colNo !== false;
      if (g('col-ca')) g('col-ca').checked = S.colCa !== false;
      if (g('col-dt')) g('col-dt').checked = !!S.colDt;
      if (g('opt-auto-fullscreen')) g('opt-auto-fullscreen').checked = !!S.autoFullscreen;
      if (g('opt-tts')) g('opt-tts').checked = S.tts !== false;
      if (g('opt-swipe')) g('opt-swipe').checked = S.swipeStudy !== false;
      // Daily-words toggle was replaced by "Hide Due Today Words"; tracking stays on.
      S.dailyWords = true;
      if (g('opt-hideduetoday')) g('opt-hideduetoday').checked = !!S.hideDueTodayBanner;
      if (g('opt-blurbtns')) g('opt-blurbtns').checked = !!S.showBlurButtons;
      if (g('opt-autospeak')) g('opt-autospeak').checked = S.autoSpeakFlip !== false;
      applyBlurBtns();
      if (g('opt-recent-page')) g('opt-recent-page').value = String(S.recentPerPage || 20);
      applyStudyPrefs();
      studyDir = S.studyDir || 'kh';
      updateStudyMethodDescs();
      buildAccentRow();
      applyAccent(S.accent, true);
      applyEnFontSize(true);
      applyEnFont(true);
      applyKhFontSize(true);
      applyKhFont(true);
      applyDensity(true);
      applyColumns(true);
      applyShowRo(true);
      updateFsLabels();
    }

    function saveSettings() {
      function g(id) {
        return el(id);
      }
      if (g('opt-density')) S.density = g('opt-density').value;
      if (g('opt-highlight')) S.highlight = g('opt-highlight').checked;
      if (g('opt-studydir')) S.studyDir = g('opt-studydir').value;
      if (g('opt-studyro')) S.studyRo = g('opt-studyro').checked;
      if (g('opt-offline')) S.offlineMode = g('opt-offline').checked;
      if (g('opt-enfontsize')) S.enFontSize = parseInt(g('opt-enfontsize').value) || 14;
      if (g('opt-khfontsize')) S.khFontSize = parseInt(g('opt-khfontsize').value) || 16;
      if (g('opt-khfont')) S.khFont = g('opt-khfont').value;
      if (g('opt-enfont')) S.enFont = g('opt-enfont').value;
      if (g('opt-showro')) S.showRo = g('opt-showro').checked;
      if (g('opt-srs')) S.srs = g('opt-srs').checked;
      if (g('opt-mc')) S.mc = g('opt-mc').checked;
      if (g('opt-match5')) S.match5 = g('opt-match5').checked;
      if (g('opt-favboost')) S.favBoost = g('opt-favboost').checked;
      if (g('opt-default-page')) S.defaultPage = g('opt-default-page').value || 'add';
      if (g('col-en')) S.colEn = g('col-en').checked;
      if (g('col-kh')) S.colKh = g('col-kh').checked;
      if (g('col-ro')) S.colRo = g('col-ro').checked;
      if (g('col-no')) S.colNo = g('col-no').checked;
      if (g('col-ca')) S.colCa = g('col-ca').checked;
      if (g('col-dt')) S.colDt = g('col-dt').checked;
      if (g('opt-auto-fullscreen')) S.autoFullscreen = g('opt-auto-fullscreen').checked;
      if (g('opt-tts')) {
        S.tts = g('opt-tts').checked;
        if (!S.tts) stopAllAudio();
      }
      if (g('opt-swipe')) S.swipeStudy = g('opt-swipe').checked;
      if (g('opt-hideduetoday')) S.hideDueTodayBanner = g('opt-hideduetoday').checked;
      if (g('opt-blurbtns')) S.showBlurButtons = g('opt-blurbtns').checked;
      if (g('opt-autospeak')) S.autoSpeakFlip = g('opt-autospeak').checked;
      if (g('opt-recent-page')) S.recentPerPage = parseInt(g('opt-recent-page').value, 10) || 20;
      lsSet(SKEY, JSON.stringify(S));
      checkAndUnlock('customizer');
    }

    function applyDensity(silent) {
      var v = el('opt-density');
      if (v) S.density = v.value;
      document.body.classList.toggle('compact', S.density === 'compact');
      if (!silent) saveSettings();
    }

    function applyEnFontSize(silent) {
      var v = parseInt((el('opt-enfontsize') || {}).value) || S.enFontSize || 14;
      var numEl = el('opt-enfontsize-num');
      if (numEl && document.activeElement !== numEl) numEl.value = v;
      S.enFontSize = v;
      document.documentElement.style.setProperty('--en-fs', v + 'px');
      document.documentElement.style.setProperty('--tbl-fs', v + 'px');
      var tp = el('tp-en');
      if (tp) tp.style.fontSize = v + 'px';
      if (!silent) {
        updateFsLabels();
        saveSettings();
      }
    }

    function applyKhFontSize(silent) {
      var v = parseInt((el('opt-khfontsize') || {}).value) || S.khFontSize || 16;
      var numEl = el('opt-khfontsize-num');
      if (numEl && document.activeElement !== numEl) numEl.value = v;
      S.khFontSize = v;
      document.documentElement.style.setProperty('--kh-fs', v + 'px');
      var tp = el('tp-kh');
      if (tp) tp.style.fontSize = v + 'px';
      if (!silent) {
        updateFsLabels();
        saveSettings();
      }
    }

    function applyKhFont(silent) {
      var v = (el('opt-khfont') || {}).value || S.khFont || "'Noto Sans Khmer',system-ui,sans-serif";
      S.khFont = v;
      document.documentElement.style.setProperty('--kh-font', v);
      var tp = el('tp-kh');
      if (tp) tp.style.fontFamily = v;
      if (!silent) saveSettings();
    }

    function applyEnFont(silent) {
      var v = (el('opt-enfont') || {}).value || S.enFont || "system-ui,-apple-system,'Segoe UI',sans-serif";
      S.enFont = v;
      document.documentElement.style.setProperty('--en-font', v);
      if (!silent) saveSettings();
    }

    function playClickSound() {
      try {
        var ctx = new(window.AudioContext || window.webkitAudioContext)();
        var buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.007));
        }
        var src = ctx.createBufferSource();
        src.buffer = buf;
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start();
        setTimeout(function() {
          try {
            ctx.close();
          } catch (e2) {}
        }, 400);
      } catch (e) {}
    }

    function skipWriting() {
      if (typeof writeIdx !== 'undefined' && typeof writeDeck !== 'undefined' && writeDeck && writeDeck.length) {
        writeIdx = (writeIdx + 1) % writeDeck.length;
        showWriteCard();
      }
    }

    function skipListening() {
      if (typeof listenIdx !== 'undefined' && typeof listenDeck !== 'undefined' && listenDeck && listenDeck.length) {
        listenIdx = (listenIdx + 1) % listenDeck.length;
        showListenCard();
      }
    }

    function initStudyPage() {
      trackStudySessionTime();
      if (studyDeck && studyDeck.length > 0 && writeDeck && writeDeck.length > 0 && listenDeck && listenDeck.length > 0) return;
      initStudy();
      startWriting();
      startListening();
    }


    function trackStudySessionTime() {
      if (!allRows.length) return;
      var khHour = new Date(Date.now() + 7 * 3600000).getUTCHours();
      if (khHour < 8) {
        lsSet(EARLY_BIRD_KEY, String((parseInt(ls(EARLY_BIRD_KEY) || '0')) + 1));
        checkAndUnlock('early_bird');
      } else if (khHour >= 22) {
        lsSet(NIGHT_OWL_KEY, String((parseInt(ls(NIGHT_OWL_KEY) || '0')) + 1));
        checkAndUnlock('night_owl');
      }
    }

    function applyShowRo(silent) {
      var v = el('opt-showro');
      if (v) S.showRo = v.checked;
      document.body.classList.toggle('hide-ro-global', !S.showRo);
      if (!silent) saveSettings();
    }

    function updateFsLabels() {
      var e1 = el('en-fs-label'),
        e2 = el('kh-fs-label');
      if (e1) e1.textContent = (parseInt((el('opt-enfontsize') || {}).value) || 14) + 'px';
      if (e2) e2.textContent = (parseInt((el('opt-khfontsize') || {}).value) || 16) + 'px';
    }

    function applyColumns(silent) {
      ['en', 'kh', 'ro', 'no', 'ca'].forEach(function(c) {
        var chk = el('col-' + c);
        if (chk) document.body.classList.toggle('hide-' + c, !chk.checked);
      });
      var dt = el('col-dt');
      if (dt) document.body.classList.toggle('show-dt', dt.checked);
      if (!silent) saveSettings();
    }

    function applyOffline() {
      saveSettings();
      if (S.offlineMode) loadFromCache();
      else loadData();
    }

    function applyAutoSync() {
      saveSettings();
      if (autoSyncTimer) {
        clearInterval(autoSyncTimer);
        autoSyncTimer = null;
      }
      if (S.autoSync > 0) autoSyncTimer = setInterval(function() {
        if (S.offlineMode) return;
        if (mutationsInFlight()) { _syncDeferred = true; return; }
        loadData();
      }, S.autoSync * 1000);
    }

    function buildAccentRow() {
      var row = el('accent-row');
      if (!row) return;
      row.innerHTML = '';
      var colors = {
        purple: '#9333ea',
        blue: '#2f72e8',
        teal: '#0fa89a',
        green: '#18a84e',
        rose: '#c91d28',
        amber: '#d98a08',
        white: '#f0f4f8',
        black: '#000000'
      };
      Object.keys(ACCENT_PRESETS).forEach(function(key) {
        var sw = document.createElement('div');
        sw.className = 'acc-swatch' + (S.accent === key ? ' active' : '');
        sw.style.background = colors[key];
        sw.title = key;
        sw.onclick = function() {
          applyAccent(key);
        };
        row.appendChild(sw);
      });
    }

    function applyAccent(key, silent) {
      S.accent = key;
      var p = ACCENT_PRESETS[key] || ACCENT_PRESETS.purple;
      document.documentElement.style.setProperty('--acc', p.acc);
      document.documentElement.style.setProperty('--acc2', p.acc2);
      document.documentElement.style.setProperty('--acc3', p.acc3);
      document.querySelectorAll('.acc-swatch').forEach(function(sw, i) {
        sw.classList.toggle('active', Object.keys(ACCENT_PRESETS)[i] === key);
      });
      if (!silent) saveSettings();
    }

    function openCfg() {
      var can = el('cfg-aq-name');
      if (can) can.textContent = MAIN_USER || '—';
      buildCfgUserList(cachedOtherUsers);
      if (!usersCacheFresh() && SCRIPT_URL) fetchOtherUsersForSettings();
      buildTabOrderList();
      buildTabVisibleList();
      updateCfgUsername();
      var urlEl = el('cfg-url');
      var urlStatus = el('cfg-url-status');
      if (urlEl) urlEl.value = SCRIPT_URL || '';
      if (urlStatus) urlStatus.textContent = SCRIPT_URL ? 'Connected' : 'Not connected';
      applyVersionLabel();
      el('cfg-ovl').classList.add('open');
    }

    function applyVersionLabel() {
      var v = el('cfg-version-label');
      if (v) v.textContent = 'v' + APP_VERSION;
    }


    function checkVersionChange() {
      applyVersionLabel();
      var last = ls(LAST_SEEN_VERSION_KEY);
      if (last && last !== APP_VERSION) {
        showVersionUpdateToast(last, APP_VERSION);
      }
      lsSet(LAST_SEEN_VERSION_KEY, APP_VERSION);
    }

    function showVersionUpdateToast(oldV, newV) {
      var box = el('tbox');
      if (!box) return;
      var div = document.createElement('div');
      div.className = 'toast achv-toast';
      div.style.cursor = 'pointer';
      div.innerHTML = '<span class="achv-toast-icon">ℹ️</span><span><strong>App updated!</strong> Now on v' + esc(newV) + '<br><span style="font-size:.65rem;opacity:.75;text-decoration:underline">Click to see the change log</span></span>';
      div.onclick = function() {
        window.open(CHANGELOG_URL, '_blank');
        checkAndUnlock('curious');
      };
      box.appendChild(div);
      setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 8000);
    }

    function closeCfg() {
      el('cfg-ovl').classList.remove('open');
    }

    function saveCfg() {
      setTimeout(updateSyncBtn, 100);
      var urlEl = el('cfg-url');
      var urlStatus = el('cfg-url-status');
      var url = ((urlEl && urlEl.value) || '').trim();
      if (url) {
        SCRIPT_URL = url;
        lsSet(URL_KEY, url);
        if (urlStatus) urlStatus.textContent = 'Connected';
        toast('URL saved. Syncing…', 'ok');
        loadData();
        loadCategoriesFromSheet();
      } else toast('Enter a valid URL.', 'err');
    }

    function saveCache(rows) {
      if (readOnlyMode) return; // never overwrite your own cache with a sheet you are only viewing
      try {
        lsSet(CACHE_KEY, JSON.stringify(rows));
        lsSet(SYNC_KEY, new Date().toISOString());
      } catch (e) {}
      updateCacheInfo();
    }

    function loadFromCache() {
      try {
        var raw = ls(CACHE_KEY);
        if (raw) {
          allRows = JSON.parse(raw);
          render();
          renderFav();
          renderProgress();
          setStatus('off', 'Offline');
          if (studyDeck.length === 0 && allRows.length > 0) initStudy();
        } else setStatus('off', 'No cache');
      } catch (e) {
        setStatus('err', 'Cache error');
      }
    }

    function clearCache() {
      if (!confirm('⚠️ Are you sure you want to clear your local cache? Your saved sheet data will re-sync.')) return;
      lsSet(CACHE_KEY, '');
      lsSet(SYNC_KEY, '');
      var ci = el('cfg-cache-info');
      if (ci) ci.textContent = 'Cleared';
      toast('Cache cleared', 'inf');
    }

    function updateCacheInfo() {
      var t = ls(SYNC_KEY),
        ci = el('cfg-cache-info'),
        sl = el('cfg-last-sync');
      if (ci) ci.textContent = t ? ('Cached ' + new Date(t).toLocaleString()) : 'No cache yet';
      if (sl) sl.textContent = t ? new Date(t).toLocaleString() : 'Never';
    }

    function applyUserBadge() {
      var b = el('ubadge');
      if (!b) return;
      var label = CURRENT_USER + (readOnlyMode ? ' 👁' : '');
      if (CURRENT_USER) {
        b.textContent = label;
        b.style.display = '';
      } else b.style.display = 'none';
    }

    function setReadOnly(name) {
      if (!readOnlyMode) _myRowsSnapshot = allRows.slice(); // remember your own words for duplicate checks
      readOnlyMode = true;
      document.body.classList.add('read-only');
      var rbn = el('ro-banner-name');
      if (rbn) rbn.textContent = name;
    }

    function exitReadOnly() {
      readOnlyMode = false;
      document.body.classList.remove('read-only');
    }

    function returnToMyAccount() {
      CURRENT_USER = MAIN_USER;
      exitReadOnly();
      tempGuestCats = [];
      if (_myRowsSnapshot) {
        allRows = _myRowsSnapshot;
        _myRowsSnapshot = null;
        // include words you added while viewing someone else
        pendingQueue.forEach(function(q) {
          var k = (q.khmer || '').trim() + '|' + (q.english || '').trim().toLowerCase();
          var has = allRows.some(function(r) { return (r.khmer || '').trim() + '|' + (r.english || '').trim().toLowerCase() === k; });
          if (!has) allRows.unshift(Object.assign({}, q, { rowIndex: 0 }));
        });
        render(); renderFav(); renderProgress();
      }
      applyUserBadge();
      refreshAllCatDropdowns();
      loadData(true);
      toast('Back to your account.', 'ok');
    }

    function openAccountQuick() {
      var aqn = el('aq-name');
      if (aqn) aqn.textContent = MAIN_USER || '—';
      el('acct-quick-ovl').classList.add('open');
      var _aqs = el('aq-user-search');
      if (_aqs) _aqs.value = '';
      buildAccountUserList();
      if (!usersCacheFresh() && SCRIPT_URL) fetchOtherUsersForPopup(); // auto-load once a day
    }
    var cachedOtherUsers = (function() {
      var c = safeJsonParse(ls(USERS_CACHE_KEY), null);
      if (c && c.user === MAIN_USER && Array.isArray(c.list) && (Date.now() - (c.ts || 0)) < USERS_CACHE_MS) return cleanUserList(c.list);
      return [];
    })();

    // Normalise a user directory: trims names, drops the retired "📋 All Words" viewer,
    // removes our own account and collapses duplicates (case/space-insensitive).
    function cleanUserList(list) {
      var seen = {}, out = [];
      (list || []).forEach(function(u) {
        var name = String((u && typeof u === 'object') ? (u.name || u.username || '') : (u || '')).trim();
        if (!name || name === '📋 All Words' || name === MAIN_USER) return;
        var key = name.toLowerCase().replace(/\s+/g, ' ');
        if (seen[key]) return;
        seen[key] = 1;
        out.push(name);
      });
      return out;
    }

    function filterUserList(boxId, inpId) {
      var box = el(boxId), inp = el(inpId);
      if (!box) return;
      var q = normSearch((inp && inp.value) || '');
      var shown = 0;
      box.querySelectorAll('.user-item').forEach(function(it) {
        var nm = normSearch(it.getAttribute('data-name') || '');
        var ok = !q || nm.indexOf(q) !== -1 || fuzzySubseq(q, nm);
        it.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      var none = box.querySelector('.user-list-none');
      if (!none && box.querySelector('.user-item')) {
        none = document.createElement('div');
        none.className = 'user-list-none';
        none.textContent = 'No accounts match.';
        box.appendChild(none);
      }
      if (none) none.style.display = (q && !shown) ? 'block' : 'none';
    }

    function storeUsersCache(list) {
      list = cleanUserList(list);
      cachedOtherUsers = list;
      lsSet(USERS_CACHE_KEY, JSON.stringify({ ts: Date.now(), user: MAIN_USER, list: list }));
    }

    function usersCacheFresh() {
      var c = safeJsonParse(ls(USERS_CACHE_KEY), null);
      return !!(c && c.user === MAIN_USER && (Date.now() - (c.ts || 0)) < USERS_CACHE_MS && cachedOtherUsers.length);
    }

    function buildCfgUserList(names) {
      var box = el('cfg-user-list');
      if (!box) return;
      names = cleanUserList(names);
      if (!names || !names.length) {
        box.innerHTML = '<div style="font-size:.75rem;color:var(--dim);text-align:center;padding:10px">' + (SCRIPT_URL ? 'Click ↻ to load accounts' : 'Connect your sheet in ⚙️') + '</div>';
        return;
      }
      box.innerHTML = '';
      names.forEach(function(name) {
        var item = document.createElement('div');
        item.className = 'user-item' + (name === CURRENT_USER ? ' current' : '');
        item.setAttribute('data-name', name);
        item.innerHTML = '<span class="user-item-name">' + esc(name) + '</span>';
        if (name === MAIN_USER) {
          var tag = document.createElement('span');
          tag.className = 'user-item-tag';
          tag.textContent = 'Active';
          item.appendChild(tag);
        } else {
          var btn = document.createElement('button');
          btn.className = 'user-view-btn';
          btn.textContent = '👁 View';
          btn.onclick = function() {
            viewAsUser(name);
            closeCfg();
          };
          item.appendChild(btn);
        }
        box.appendChild(item);
      });
      filterUserList('cfg-user-list', 'cfg-user-search');
    }

    function fetchOtherUsersForSettings() {
      var btn = el('cfg-refresh-btn');
      if (btn) btn.classList.add('loading');
      if (!SCRIPT_URL) {
        toast('Connect your sheet in ⚙️ first.', 'err');
        if (btn) btn.classList.remove('loading');
        return;
      }
      fetch(SCRIPT_URL + '?action=getAllUsers').then(function(r) {
        return r.json();
      }).then(function(j) {
        if (btn) btn.classList.remove('loading');
        if (!j.success) throw new Error(j.error || 'Failed');
        var list = cleanUserList(j.users || []);
        storeUsersCache(list);
        buildCfgUserList(list);
        buildAccountUserList(list);
      }).catch(function(err) {
        if (btn) btn.classList.remove('loading');
        toast('Failed: ' + err.message, 'err');
      });
    }

    function buildAccountUserList(names) {
      var box = el('aq-user-list');
      if (!box) return;
      names = cleanUserList(names || cachedOtherUsers || []);
      if (!names.length) {
        box.innerHTML = '<div style="font-size:.75rem;color:var(--dim);text-align:center;padding:10px">' + (SCRIPT_URL ? 'Click ↻ to load accounts' : 'Connect your sheet in ⚙️') + '</div>';
        return;
      }
      box.innerHTML = '';
      names.forEach(function(name) {
        var item = document.createElement('div');
        item.className = 'user-item' + (name === CURRENT_USER ? ' current' : '');
        item.setAttribute('data-name', name);
        item.innerHTML = '<span class="user-item-name">' + esc(name) + '</span>';
        if (name === MAIN_USER) {
          var tag = document.createElement('span');
          tag.className = 'user-item-tag';
          tag.textContent = 'Active';
          item.appendChild(tag);
        } else {
          var btn = document.createElement('button');
          btn.className = 'user-view-btn';
          btn.textContent = '👁 View';
          btn.onclick = function() {
            viewAsUser(name);
            el('acct-quick-ovl').classList.remove('open');
          };
          item.appendChild(btn);
        }
        box.appendChild(item);
      });
      filterUserList('aq-user-list', 'aq-user-search');
    }

    function fetchOtherUsersForPopup() {
      var btn = el('aq-refresh-btn');
      if (btn) btn.classList.add('loading');
      if (!SCRIPT_URL) {
        toast('Connect your sheet in ⚙️ first.', 'err');
        if (btn) btn.classList.remove('loading');
        return;
      }
      fetch(SCRIPT_URL + '?action=getAllUsers').then(function(r) {
        return r.json();
      }).then(function(j) {
        if (btn) btn.classList.remove('loading');
        if (!j.success) throw new Error(j.error || 'Failed');
        var list = cleanUserList(j.users || []);
        storeUsersCache(list);
        buildAccountUserList(list);
      }).catch(function(err) {
        if (btn) btn.classList.remove('loading');
        toast('Failed: ' + err.message, 'err');
      });
    }

    function viewAsUser(name) {
      closeCfg();
      CURRENT_USER = name;
      setReadOnly(name);
      applyUserBadge();
      loadData();
      toast('Viewing ' + name + ' (read-only)', 'inf');
    }

    function checkStreakReset() {
      var sd = safeJsonParse(ls(STREAK_KEY), {
        count: 0,
        lastDate: ''
      });
      if (!sd.lastDate || !sd.count) return;
      var _p = function(x) {
        return x < 10 ? '0' + x : String(x);
      };
      var _dn = new Date(Date.now() + 7 * 3600000);
      var _today = _dn.getUTCFullYear() + '-' + _p(_dn.getUTCMonth() + 1) + '-' + _p(_dn.getUTCDate());
      var _yn = new Date(Date.now() + 7 * 3600000 - 86400000);
      var _yest = _yn.getUTCFullYear() + '-' + _p(_yn.getUTCMonth() + 1) + '-' + _p(_yn.getUTCDate());
      if (sd.lastDate !== _today && sd.lastDate !== _yest) {
        sd.count = 0;
        lsSet(STREAK_KEY, JSON.stringify(sd));
      }
    }


    function armBackGuard() {
      try {
        history.pushState({
          kvGuard: true
        }, '', location.href);
        window.addEventListener('popstate', function() {
          history.pushState({
            kvGuard: true
          }, '', location.href);
        });
      } catch (e) {}
    }

    function init() {
      checkStreakReset();
      updateStudyStreak();
      checkVersionChange();
      armBackGuard();
      loadSettings();
      refreshAllCatDropdowns();
      buildReferencePages();
      updateCacheInfo();
      processPendingQueue();
      if (!MAIN_USER) {
        el('user-ovl').classList.add('open');
        setTimeout(function() {
          var ui = el('user-inp');
          if (ui) ui.focus();
        }, 100);
        setStatus('off', 'Not signed in');
        goPage('view', 'nav-view');
      } else {
        CURRENT_USER = MAIN_USER;
        applyUserBadge();
        updateCfgUsername();
        var dp = safeDefaultPage();
        var navMap = {
          view: 'nav-view',
          add: 'nav-add',
          trans: 'nav-trans',
          study: 'nav-study',
          progress: 'nav-progress',
          ref: 'nav-ref',
          dash: 'nav-dash'
        };
        goPage(dp, navMap[dp] || 'nav-add');


        var _isVerified = !SCRIPT_URL || !!ls('kv_verified');
        if (!_isVerified) {
          setStatus('off', 'Not verified');
        } else {
          if (dp === 'study') initStudyPage();
          if (dp === 'progress') renderProgress();
          // Preload the dashboard (cache, or one fetch after 6:00 AM KH) so the tab opens instantly.
          setTimeout(function() { loadDashboard(false, dp !== 'dash'); }, dp === 'dash' ? 0 : 1200);


          setTimeout(auditAchievements, 2500);
          if (S.offlineMode) {
            loadFromCache();
          } else if (SCRIPT_URL) {
            if (ls(CACHE_KEY)) loadFromCache();
            loadData();
            loadCategoriesFromSheet();
            restoreUserDataFromSheet();
          } else setStatus('off', 'Not connected');
        }
      }
      var _di = el('dict-input'),
        _dsb = el('dict-search-btn'),
        _dc = el('dict-clear');
      if (_di) _di.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') dictSearch(e.target.value);
      });
      if (_dsb) _dsb.addEventListener('click', function() {
        if (_di) dictSearch(_di.value);
      });
      if (_dc) _dc.addEventListener('click', function() {
        if (_di) {
          _di.value = '';
          _di.focus();
        }
        _dc.style.display = 'none';
      });
      if (_di) _di.addEventListener('input', function() {
        if (_dc) _dc.style.display = this.value ? 'block' : 'none';
      });
    }

    el('user-inp').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var p = el('user-pass');
        if (p && !p.value) p.focus();
        else handleLogin();
      }
    });
    el('user-pass').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLogin();
    });
    var _ssn = el('sset-new-name');
    if (_ssn) _ssn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') createAndAddSet();
    });
    el('newcat-inp').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomCat();
    });

    function closeStep2() {
      var ov = el('user-step2-ovl');
      if (!ov.classList.contains('open')) return; // already handled (double tap)
      ov.classList.remove('open');
      onboardComplete(true);
    }

    function closeStep2AndImport() {
      el('user-step2-ovl').classList.remove('open');
      openImportModal();
    }

    var _onboardInFlight = false;
    function onboardComplete(registerNew) {
      // Single-flight: double taps / Enter + click used to start two account creations.
      if (_onboardInFlight) return;
      _onboardInFlight = true;
      var credP = Promise.resolve();
      if (registerNew !== false) {
        if (window._pendingPassword) {
          credP = registerUserCredentials(MAIN_USER, window._pendingPassword);
          window._pendingPassword = null;
        }
      }
      if (SCRIPT_URL) {
        setStatus('spin-dot', 'Setting up…');
        credP.then(function() {
          return fetch(SCRIPT_URL + '?action=getOrCreateUser&name=' + encodeURIComponent(MAIN_USER));
        })
          .then(function(r) {
            return r.json();
          }).then(function(j) {

            lsSet('kv_verified', '1');
            toast(j.created ? 'Account created for ' + MAIN_USER + '!' : 'Welcome back, ' + MAIN_USER + '!', 'ok');
            loadData();
            loadCategoriesFromSheet();
            restoreUserDataFromSheet();
            var dp = safeDefaultPage(),
              navMap = {
                view: 'nav-view',
                add: 'nav-add',
                trans: 'nav-trans',
                study: 'nav-study',
                progress: 'nav-progress',
                ref: 'nav-ref',
                dash: 'nav-dash'
              };
            goPage(dp, navMap[dp] || 'nav-add');
          }).catch(function(err) {


            toast('Setup error: ' + err.message, 'err');
            setStatus('err', 'Not verified');
          }).finally(function() {
            _onboardInFlight = false;
          });
      } else {
        _onboardInFlight = false;
        setStatus('off', 'Not connected');
        goPage('add', 'nav-add');
      }
    }

    var _syncInFlight = false;
    function loadData(force) {
      var user = CURRENT_USER || MAIN_USER;
      // Never read the sheet while deletes / imports / edits are still being written
      if (mutationsInFlight()) {
        _syncDeferred = true;
        return;
      }
      if (!force && Date.now() - lastWriteTime < 8000) {
        return;
      }
      if (!SCRIPT_URL || !user) {
        setStatus('off', 'Not connected');
        return;
      }
      if (S.offlineMode) {
        loadFromCache();
        return;
      }
      var sb = el('sync-btn');
      if (sb) {
        sb.classList.add('spin-icon');
        sb.disabled = true;
      }
      if (_syncInFlight) return;
      _syncInFlight = true;
      if (!allRows.length) showIndexSkeleton();
      setBusy(1);
      setStatus('spin-dot', 'Syncing…');
      fetch(SCRIPT_URL + '?action=getData&user=' + encodeURIComponent(user))
        .then(function(r) {
          return r.json();
        }).then(function(json) {
          _syncInFlight = false;
          setBusy(-1);
          if (sb) {
            sb.classList.remove('spin-icon');
            sb.disabled = false;
          }
          if (!json.success) throw new Error(json.error || 'Error');
          if (user !== (CURRENT_USER || MAIN_USER)) return; // user switched while loading — drop stale result
          var d = json.data || {};
          var freshRows = d[user] || mergeAll(d);
          // A delete queued while this sync was in flight must not reappear
          if (_delQueue.length) {
            var _pendDel = {};
            _delQueue.forEach(function(q) { _pendDel[q.id] = 1; });
            freshRows = freshRows.filter(function(r) { return !(r.id && _pendDel[r.id]); });
          }


          var _mergedKeys = {};
          freshRows.forEach(function(r) {
            _mergedKeys[(r.khmer || '').trim() + '|' + (r.english || '').trim().toLowerCase()] = 1;
          });
          var _stillPending = pendingQueue.filter(function(item) {
            return !readOnlyMode && !_mergedKeys[(item.khmer || '').trim() + '|' + (item.english || '').trim().toLowerCase()];
          });
          allRows = freshRows.concat(_stillPending);
          saveCache(allRows);
          setStatus('ok', allRows.length + ' words');
          if (studyDeck.length === 0 && allRows.length > 0) initStudy();
          if (readOnlyMode) {
            tempGuestCats = [];
            allRows.forEach(function(r) {
              getWordCategories(r).forEach(function(c) {
                if (c && c !== 'Uncategorized' && DEFAULT_CATS.indexOf(c) === -1 && customCats.indexOf(c) === -1 && tempGuestCats.indexOf(c) === -1) tempGuestCats.push(c);
              });
            });
            refreshAllCatDropdowns();
          }
          render();
          renderFav();
          renderProgress();
        }).catch(function(err) {
          _syncInFlight = false;
          setBusy(-1);
          if (sb) {
            sb.classList.remove('spin-icon');
            sb.disabled = false;
          }
          setStatus('err', 'Sync failed');
          toast('Sync failed: ' + err.message, 'err');
        });
    }

    // Placeholder rows for the word index while the first sync runs; mirrors visible columns.
    function showIndexSkeleton() {
      var tbody = el('tbody');
      if (!tbody) return;
      var cols = [['col-sel', 16], ['col-en', 70], ['col-kh', 60], ['col-ro', 65], ['col-no', 50], ['col-ca', 45], ['col-dt', 55]];
      var html = '';
      for (var i = 0; i < 10; i++) {
        html += '<tr class="skel-tr">' + cols.map(function(c, j) {
          var w = j === 0 ? c[1] + 'px' : Math.max(30, c[1] - ((i * 7 + j * 13) % 25)) + '%';
          return '<td class="' + c[0] + '"><div class="skel" style="height:' + (j === 0 ? 14 : 12) + 'px;width:' + w + ';margin:0"></div></td>';
        }).join('') + '</tr>';
      }
      tbody.innerHTML = html;
      var emp = el('empty');
      if (emp) emp.style.display = 'none';
    }

    function mergeAll(data) {
      var out = [],
        seen = {};
      Object.values(data).forEach(function(rows) {
        if (!Array.isArray(rows)) return;
        rows.forEach(function(r) {
          var k = (r.khmer || '').trim() + '|' + (r.english || '').trim().toLowerCase();
          if (!seen[k]) {
            seen[k] = 1;
            out.push(r);
          }
        });
      });
      return out;
    }

    var queueRunning = false;
    var _queueBatchSaved = 0;
    var _queueWasEmpty = true;
    var _queueRetries = 0; // exponential backoff counter for the add-word queue

    function processPendingQueue() {
      if (queueRunning || !SCRIPT_URL || !pendingQueue.length || importState.active) return;
      if (SCRIPT_URL && !ls('kv_verified')) return;
      if (_queueWasEmpty) {
        _queueBatchSaved = 0;
        _queueWasEmpty = false;
        if (!saveState.active) {
          saveState.done = 0;
          saveState.total = pendingQueue.length;
          saveState.active = true;
          updateSaveProgress();
        }
      }
      queueRunning = true;
      var _seenQKeys = {};
      var _qFiltered = false;
      pendingQueue = pendingQueue.filter(function(q) {
        var k = (q.khmer || '').trim() + '|' + (q.english || '').trim().toLowerCase();
        if (_seenQKeys[k]) { _qFiltered = true; return false; }
        _seenQKeys[k] = 1;
        return true;
      });
      if (_qFiltered) savePendingQueue();
      if (!pendingQueue.length) { queueRunning = false; return; }
      var item = pendingQueue[0];
      var _dupKey = (item.khmer || '').trim() + '|' + (item.english || '').trim().toLowerCase();

      var _alreadyOnSheet = !readOnlyMode && allRows.some(function(r) {
        return r.id &&
          ((r.khmer || '').trim() + '|' + (r.english || '').trim().toLowerCase()) === _dupKey;
      });
      if (_alreadyOnSheet) {
        pendingQueue.shift();
        savePendingQueue();
        queueRunning = false;
        saveState.done++;
        if (!pendingQueue.length) {
          saveState.active = false;
          var _sec2a = el('imp-bar-section-2');
          if (_sec2a) _sec2a.style.display = 'none';
        } else {
          updateSaveProgress();
        }
        toast('✓ Word already saved — skipped duplicate.', 'inf');
        if (pendingQueue.length) setTimeout(processPendingQueue, 200);
        return;
      }
      setBusy(1);
      updateSaveProgress();
      var url = buildAddUrl(item);
      fetch(url).then(function(r) {
        return r.json();
      }).then(function(j) {
        setBusy(-1);
        if (j.success) {
          _queueRetries = 0;
          lastWriteTime = Date.now();
          pendingQueue.shift();
          savePendingQueue();
          _queueBatchSaved++;
          saveState.done++;
          if (pendingQueue.length > 0) {
            updateSaveProgress();
            queueRunning = false;
            setTimeout(processPendingQueue, 50);
          } else {
            saveState.active = false;
            var _sec2b = el('imp-bar-section-2');
            if (_sec2b) _sec2b.style.display = 'none';
            setStatus('ok', allRows.length + ' words');
            queueRunning = false;
            _queueWasEmpty = true;
            toast('✓ ' + _queueBatchSaved + ' word' + (_queueBatchSaved !== 1 ? 's' : '') + ' saved!', 'ok');
          }
        } else {
          queueRunning = false;
          _queueRetries++;
          setTimeout(processPendingQueue, _backoffMs(_queueRetries));
        }
      }).catch(function() {
        setBusy(-1);
        queueRunning = false;
        setStatus('err', 'Sync failed');
        _queueRetries++;
        setTimeout(processPendingQueue, _backoffMs(_queueRetries));
      });
    }

    function buildAddUrl(data) {
      var url = new URL(SCRIPT_URL);
      url.searchParams.set('action', 'addWord');

      ['english', 'khmer', 'romanization', 'notes', 'category', 'tab', 'user', 'reqId', 'dateAdded'].forEach(function(f) {
        url.searchParams.set(f, data[f] || '');
      });
      return url.toString();
    }

    function goPage(id, navId) {
      document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
      });
      var page = el('page-' + id);
      if (page) page.classList.add('active');
      document.querySelectorAll('.nav button').forEach(function(b) {
        b.classList.remove('active');
      });
      var navBtn = el(navId);
      if (navBtn) navBtn.classList.add('active');
      if (id !== 'view') exitBulk();
      if (id !== 'study' && _studySessionActive) flushStudySync();
      if (id !== 'study') stopAllAudio();
      if (id === 'notebook') nbInit();
      if (id === 'study') {
        var fsb = el('fc-speak-btn');
        if (fsb) fsb.style.display = studyDeck.length > 0 ? 'block' : 'none';
      }
    }

    function toggleConfSort() {
      if (quickSort === 'conf') {
        quickSort = 'confdesc';
      } else if (quickSort === 'confdesc') {
        quickSort = 'conf';
      } else {
        quickSort = 'conf';
      }
      sortCol = -1;
      document.querySelectorAll('.sort-chip').forEach(function(c) {
        c.classList.remove('active');
      });
      var sc = el('sc-conf');
      if (sc) {
        sc.classList.add('active');
        sc.textContent = quickSort === 'conf' ? '🔴 Weakest' : '🟢 Strongest';
        sc.title = quickSort === 'conf' ? 'Sorting: Weakest first (tap for Strongest)' : 'Sorting: Strongest first (tap for Weakest)';
      }
      render();
    }

    function copyKhColumn() {
      var order = quickSort || 'view';
      var rows = getRows().slice();
      if (order === 'weak' || order === 'strong') {
        rows.sort(function(a, b) {
          var d = confRankVal(a) - confRankVal(b);
          if (order === 'strong') d = -d;
          if (d) return d;
          var ea = (a.english || '').toLowerCase(),
            eb = (b.english || '').toLowerCase();
          return ea < eb ? -1 : ea > eb ? 1 : 0;
        });
      }
      var list = rows.map(function(r) {
        return (r.khmer || '').trim();
      }).filter(Boolean);
      if (!list.length) {
        toast('Nothing to copy.', 'inf');
        return;
      }
      var text = list.join('\n');

      function _done() {
        toast('Copied ' + list.length + ' Khmer words \u2713', 'ok');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(_done).catch(function() {
          _copyFallback(text, _done);
        });
      } else _copyFallback(text, _done);
    }

    function _copyFallback(text, cb) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (cb) cb();
      } catch (e) {
        toast('Could not copy on this device.', 'err');
      }
    }

    function setQuickSort(mode) {
      quickSort = mode;
      sortCol = -1;
      document.querySelectorAll('.sort-chip').forEach(function(c) {
        c.classList.remove('active');
      });
      var sc = el('sc-' + mode);
      if (sc) sc.classList.add('active');
      var scc = el('sc-conf');
      if (scc && mode !== 'conf') scc.textContent = '\uD83D\uDD34 Weakest';
      render();
    }

    function clickSort(col) {
      if (sortCol === col) sortAsc = !sortAsc;
      else {
        sortCol = col;
        sortAsc = true;
      }
      quickSort = '';
      document.querySelectorAll('.sort-chip').forEach(function(c) {
        c.classList.remove('active');
      });
      updateSortTH();
      render();
    }

    function updateSortTH() {
      document.querySelectorAll('#tbl thead th').forEach(function(th, i) {
        th.classList.remove('sa', 'sd');
        if (i - 1 === sortCol) th.classList.add(sortAsc ? 'sa' : 'sd');
      });
    }

    function clickFavSort(col) {
      if (favSortCol === col) favSortAsc = !favSortAsc;
      else {
        favSortCol = col;
        favSortAsc = true;
      }
      renderFav();
    }

    function applyBlurBtns() {
      var show = !!S.showBlurButtons;
      ['btn-kh', 'btn-en'].forEach(function(id) { var b = el(id); if (b) b.style.display = show ? '' : 'none'; });
      if (!show && blurMode) toggleBlur(blurMode); // clear any active mask so content isn't stuck hidden
    }

    function toggleBlur(which) {
      document.querySelectorAll('td.peeked').forEach(function(td) {
        td.classList.remove('peeked');
      });
      blurMode = (blurMode === which) ? '' : which;
      var tbl = el('tbl');
      if (!tbl) return;
      tbl.classList.remove('blur-en', 'blur-kh');
      if (blurMode === 'en') tbl.classList.add('blur-en');
      if (blurMode === 'kh') tbl.classList.add('blur-kh');
      var be = el('btn-en'),
        bk = el('btn-kh');
      if (be) be.classList.toggle('active', blurMode === 'en');
      if (bk) bk.classList.toggle('active', blurMode === 'kh');
    }

        function studySelectedWords() {
      if (!selectedKeys || !selectedKeys.size) {
        toast('Select at least one word to study.', 'inf');
        return;
      }
      var rowsToStudy = allRows.filter(function(r) {
        return selectedKeys.has(wordKey(r));
      });
      if (!rowsToStudy.length) {
        toast('No matching words found.', 'err');
        return;
      }
      goPage('study', 'nav-study');
      exitBulk();
      studyDeck = rowsToStudy.slice();
      studyIdx = 0;
      sessionK = 0;
      sessionM = 0;
      sessionU = 0;
      matchBuffer = [];
      showCard();
      toast('Studying ' + studyDeck.length + ' selected words! ✓', 'ok');
    }

    function toggleBulk() {
      if (bulkMode) exitBulk();
      else enterBulk();
    }

    function enterBulk() {
      bulkMode = true;
      selectedKeys.clear();
      document.body.classList.add('bulk-mode');
      var bs = el('btn-sel');
      if (bs) bs.classList.add('sel-active');
      updateBulkBar();
      render();
    }

    function exitBulk() {
      bulkMode = false;
      selectedKeys.clear();
      document.body.classList.remove('bulk-mode');
      var bs = el('btn-sel');
      if (bs) bs.classList.remove('sel-active');
      var sa = el('sel-all');
      if (sa) sa.checked = false;
      render();
    }

    function updateBulkBar() {
      var bi = el('bulk-info');
      if (bi) bi.textContent = selectedKeys.size + ' selected';
    }

    function selectAll(checked) {
      var rows = getRows();
      selectedKeys.clear();
      if (checked) rows.forEach(function(r) {
        selectedKeys.add(wordKey(r));
      });
      updateBulkBar();
      render();
    }


    function openBulkCat() {
      if (!selectedKeys.size) {
        toast('Select some entries first.', 'err');
        return;
      }
      populateCatDropdown('bulkcat-sel', false, 'Words');
      var bc = el('bulkcat-count');
      if (bc) bc.textContent = selectedKeys.size;
      el('bulkcat-ovl').classList.add('open');
    }

    function applyBulkCat() {
      var cat = (el('bulkcat-sel') || {}).value || 'Words',
        keys = Array.from(selectedKeys);
      var _byKey = new Map();
      allRows.forEach(function(r) { _byKey.set(wordKey(r), r); });
      keys.forEach(function(k) {
        var r = _byKey.get(k);
        if (r) setWordCategories(r, [cat]);
      });
      el('bulkcat-ovl').classList.remove('open');
      toast('Category updated for ' + keys.length + ' entries — syncing…', 'ok');
      saveCache(allRows);
      setBusy(1);
      var done = 0;
      if (SCRIPT_URL) {
        keys.forEach(function(k) {
          var r = _byKey.get(k);
          if (r && (r.rowIndex > 0 || r.id)) {
            var url = new URL(SCRIPT_URL);
            url.searchParams.set('action', 'updateWord');

            ['english', 'khmer', 'romanization', 'notes', 'category', 'rowIndex'].forEach(function(f) {
              url.searchParams.set(f, r[f] || '');
            });
            url.searchParams.set('id', r.id || '');
            url.searchParams.set('tab', CURRENT_USER || MAIN_USER);
            url.searchParams.set('user', CURRENT_USER || MAIN_USER);
            fetch(url.toString()).catch(function() {}).finally(function() {
              done++;
              if (done >= keys.length) setBusy(-1);
            });
          } else {
            done++;
            if (done >= keys.length) setBusy(-1);
          }
        });
      } else setBusy(-1);
      exitBulk();
      render();
    }

    function bulkDelete() {
      if (_delRunning) {
        toast('Still deleting — please wait a moment.', 'inf');
        return;
      }
      if (!selectedKeys.size) {
        toast('Select some entries first.', 'err');
        return;
      }
      if (!confirm('Delete ' + selectedKeys.size + ' entries? Cannot be undone.')) return;
      var toDelete = allRows.filter(function(r) {
        return selectedKeys.has(wordKey(r));
      });
      allRows = allRows.filter(function(r) {
        return !selectedKeys.has(wordKey(r));
      });
      toDelete.forEach(function(r) {
        favorites.delete(wordKey(r));
      });
      saveCache(allRows);
      saveFavorites();
      exitBulk();
      render();
      renderFav();
      renderProgress();
      if (SCRIPT_URL) {
        var dq = toDelete.filter(function(r) {
          return !!r.id;
        }).map(function(r) { return r.id; });
        if (!dq.length) {
          toast(toDelete.length + ' entr' + (toDelete.length === 1 ? 'y' : 'ies') + ' deleted', 'ok');
        } else {
          enqueueDeletes(dq, CURRENT_USER || MAIN_USER);
        }
      } else {
        toast(toDelete.length + ' entr' + (toDelete.length === 1 ? 'y' : 'ies') + ' deleted', 'ok');
      }
    }

    function confRankVal(r) {
      var c = confidence[wordKey(r)];
      return c === undefined ? 0.5 : c;
    }

    function toggleFav(r) {
      var k = wordKey(r);
      if (favorites.has(k)) favorites.delete(k);
      else favorites.add(k);
      saveFavorites();
    }

    function toggleEditStar() {
      if (!editRow) return;
      toggleFav(editRow);
      var btn = el('sheet-star');
      if (btn) btn.classList.toggle('fav', isFav(editRow));
      render();
      renderFav();
    }

    function renderFav() {
      var q = ((el('fq') || {}).value || '').trim().toLowerCase();
      var rows = allRows.filter(function(r) {
        return isFav(r);
      });
      if (q) rows = rows.filter(function(r) {
        return ((r.english || '') + (r.khmer || '') + (r.romanization || '') + (r.notes || '')).toLowerCase().indexOf(q) !== -1;
      });
      if (favSortCol >= 0) {
        var flds = ['english', 'khmer', 'romanization', 'notes', 'category'],
          f = flds[favSortCol];
        rows.sort(function(a, b) {
          var va = (a[f] || '').toLowerCase(),
            vb = (b[f] || '').toLowerCase();
          if (!va && vb) return 1;
          if (va && !vb) return -1;
          return favSortAsc ? (va < vb ? -1 : va > vb ? 1 : 0) : (va < vb ? 1 : va > vb ? -1 : 0);
        });
      }
      var tbody = el('fav-tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      rows.forEach(function(r) {
        var tr = document.createElement('tr');
        addRowHandlers(tr, r);
        var ten = mkTd('col-en en-cell', '');
        ten.innerHTML = q ? hlText(r.english || '', q) : esc(r.english || '');
        var tkh = mkTd('col-kh kh-cell kh', '');
        var khSpan = document.createElement('span');
        khSpan.innerHTML = q ? hlText(r.khmer || '', q) : esc(r.khmer || '');
        var spkBtn = document.createElement('button');
        spkBtn.className = 'row-speak-btn';
        spkBtn.textContent = ' 🔊';
        spkBtn.title = 'Hear Khmer';
        (function(row, khTd) {
          spkBtn.onclick = function(e) {
            e.stopPropagation();
            if (blurMode === 'kh') {
              if (khTd.classList.contains('peeked')) {
                speakKhmer(row.khmer || '');
              } else {
                khTd.classList.add('peeked');
              }
              return;
            }
            speakKhmer(row.khmer || '');
          };
        })(r, tkh);
        tkh.appendChild(khSpan);
        tkh.appendChild(spkBtn);
        var tro = mkTd('col-ro ro-cell', '');
        tro.innerHTML = q ? hlText(r.romanization || '', q) : esc(r.romanization || '');
        var tno = mkTd('col-no no-cell', r.notes || '');
        var tca = mkTd('col-ca', '');
        var bdg = document.createElement('span');
        bdg.className = 'badge ' + bCls(getWordCategories(r)[0]);
        bdg.textContent = catLabel(r) || '—';
        tca.appendChild(bdg);
        [ten, tkh, tro, tno, tca].forEach(function(td) {
          addCellHandlers(td);
        });
        tr.appendChild(ten);
        tr.appendChild(tkh);
        tr.appendChild(tro);
        tr.appendChild(tno);
        tr.appendChild(tca);
        tbody.appendChild(tr);
      });
      var fe = el('fav-empty');
      if (fe) fe.style.display = rows.length === 0 ? 'block' : 'none';
    }

    function getRows() {
      var q = ((el('q') || {}).value || '').trim().toLowerCase(),
        cat = ((el('view-cat-filter') || {}).value) || 'All',
        cfl = ((el('view-conf-filter') || {}).value) || 'all';
      var rows = allRows.slice();
      if (cat === 'All') {} else if (cat === '__nosent__') rows = rows.filter(function(r) {
        return !wordHasCat(r, 'Sentences');
      });
      else if (cat === '__fav__') rows = rows.filter(function(r) {
        return isFav(r);
      });
      else rows = rows.filter(function(r) {
        return wordHasCat(r, cat);
      });
      if (cfl !== 'all') rows = rows.filter(function(r) {
        var c = confidence[wordKey(r)];
        if (cfl === 'got') return c === 2;
        if (cfl === 'kinda') return c === 1;
        if (cfl === 'unknown') return c === 0;
        if (cfl === 'unstudied') return c === undefined;
        if (cfl === 'weak') return c === 0 || c === undefined;
        return true;
      });
      if (q) rows = rows.filter(function(r) {
        return ((r.english || '') + (r.khmer || '') + (r.romanization || '') + (r.notes || '') + (r.category || '')).toLowerCase().indexOf(q) !== -1;
      });
      if (quickSort === 'conf' || quickSort === 'confdesc') {
        rows.sort(function(a, b) {
          var d = confRankVal(a) - confRankVal(b);
          if (quickSort === 'confdesc') d = -d;
          if (d) return d;
          var ea = (a.english || '').toLowerCase(),
            eb = (b.english || '').toLowerCase();
          return ea < eb ? -1 : ea > eb ? 1 : 0;
        });
        return rows;
      }
      if (quickSort === 'date') {
        rows.sort(function(a, b) {
          var da = a.dateAdded || '',
            db = b.dateAdded || '';
          if (!da && db) return 1;
          if (da && !db) return -1;
          return da < db ? 1 : da > db ? -1 : 0;
        });
      } else if (sortCol >= 0) {
        var flds = ['english', 'khmer', 'romanization', 'notes', 'category'],
          f = flds[sortCol];
        rows.sort(function(a, b) {
          var va = (a[f] || '').toLowerCase(),
            vb = (b[f] || '').toLowerCase();
          if (!va && vb) return 1;
          if (va && !vb) return -1;
          return sortAsc ? (va < vb ? -1 : va > vb ? 1 : 0) : (va < vb ? 1 : va > vb ? -1 : 0);
        });
      }
      return rows;
    }

    function render() {
      var rows = getRows(),
        q = S.highlight ? ((el('q') || {}).value || '').trim().toLowerCase() : '';
      var tbody = el('tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      rows.forEach(function(r) {
        var k = wordKey(r),
          tr = document.createElement('tr');
        if (selectedKeys.has(k)) tr.classList.add('selected');
        addRowHandlers(tr, r);
        var tsel = mkTd('col-sel', ''),
          chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.className = 'row-chk';
        chk.checked = selectedKeys.has(k);
        chk.addEventListener('change', function(e) {
          e.stopPropagation();
          if (chk.checked) selectedKeys.add(k);
          else selectedKeys.delete(k);
          tr.classList.toggle('selected', chk.checked);
          updateBulkBar();
        });
        tsel.appendChild(chk);
        var ten = mkTd('col-en en-cell', '');


        var enSpan = document.createElement('span');
        enSpan.innerHTML = q ? hlText(r.english || '', q) : esc(r.english || '');
        ten.appendChild(enSpan);
        var tkh = mkTd('col-kh kh-cell kh', '');
        var khSpan = document.createElement('span');
        khSpan.innerHTML = q ? hlText(r.khmer || '', q) : esc(r.khmer || '');
        var spkBtn = document.createElement('button');
        spkBtn.className = 'row-speak-btn';
        spkBtn.textContent = ' 🔊';
        spkBtn.title = 'Hear Khmer';
        (function(row) {
          spkBtn.onclick = function(e) {
            e.stopPropagation();
            if (blurMode === 'kh') {
              var _favTd = e.currentTarget ? e.currentTarget.closest('td') : null;
              if (_favTd && _favTd.classList.contains('peeked')) {
                speakKhmer(row.khmer || '');
              } else if (_favTd) {
                _favTd.classList.add('peeked');
              }
              return;
            }
            speakKhmer(row.khmer || '');
          };
        })(r);
        tkh.appendChild(khSpan);
        tkh.appendChild(spkBtn);
        var tro = mkTd('col-ro ro-cell', '');
        tro.innerHTML = q ? hlText(r.romanization || '', q) : esc(r.romanization || '');
        var tno = mkTd('col-no no-cell', ''),
          notes = r.notes || '';
        if (notes.length > 55) {
          tno.innerHTML = '<span class="note-short">' + esc(notes.slice(0, 55)) + '…</span><span class="note-full" style="display:none;white-space:normal">' + (q ? hlText(notes, q) : esc(notes)) + '</span> <button class="note-btn" onclick="expandNote(event,this)">▾</button>';
        } else tno.innerHTML = q ? hlText(notes, q) : esc(notes);
        var tca = mkTd('col-ca', ''),
          bdg = document.createElement('span');
        bdg.className = 'badge ' + bCls(getWordCategories(r)[0]);
        bdg.textContent = catLabel(r) || '—';
        tca.appendChild(bdg);
        var tdt = mkTd('col-dt dt-cell', r.dateAdded || '');
        [ten, tkh, tro, tno, tca, tdt].forEach(function(td) {
          addCellHandlers(td);
        });
        tr.appendChild(tsel);
        tr.appendChild(ten);
        tr.appendChild(tkh);
        tr.appendChild(tro);
        tr.appendChild(tno);
        tr.appendChild(tca);
        tr.appendChild(tdt);
        tbody.appendChild(tr);
      });
      var emp = el('empty');
      if (emp) emp.style.display = rows.length === 0 ? 'block' : 'none';
      var emm = el('empty-msg');
      if (emm) emm.textContent = allRows.length === 0 ? 'Add some words or tap ↻ to sync.' : 'No entries match.';
      var bar = el('bar');
      if (bar) {
        var cv = (el('view-cat-filter') || {}).value || 'All',
          lbl = cv === 'All' ? '' : (cv === '__nosent__' ? ' · All exc. Sentences' : ' · ' + cv);
        bar.textContent = 'Showing ' + rows.length + ' of ' + allRows.length + ' entries' + lbl;
      }
    }

    function mkTd(cls, txt) {
      var td = document.createElement('td');
      if (cls) td.className = cls;
      if (txt) td.textContent = txt;
      return td;
    }

    function addRowHandlers(tr, row) {
      var timer = null,
        didLong = false;

      function onStart() {
        didLong = false;
        timer = setTimeout(function() {
          didLong = true;

          if (window.getSelection) window.getSelection().removeAllRanges();
          document.body.style.webkitUserSelect = 'none';
          document.body.style.userSelect = 'none';
          setTimeout(function() {
            document.body.style.webkitUserSelect = '';
            document.body.style.userSelect = '';
          }, 400);
          document.addEventListener('touchend', function _preventLongTouchEnd(ev) {
            ev.preventDefault();
            document.removeEventListener('touchend', _preventLongTouchEnd, true);
          }, {
            capture: true,
            once: true
          });
          openEditSheet(row);

          setTimeout(function() {
            var a = document.activeElement;
            if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT')) a.blur();
          }, 60);
        }, 520);
      }

      function onCancel() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
      tr.addEventListener('touchstart', function(e) {
        onStart();
      }, {
        passive: false
      });
      tr.addEventListener('touchmove', onCancel, {
        passive: true
      });
      tr.addEventListener('touchend', onCancel);
      tr.addEventListener('mousedown', onStart);
      tr.addEventListener('mouseup', onCancel);
      tr.addEventListener('mouseleave', onCancel);
      tr._didLong = function() {
        return didLong;
      };
      tr._clearLong = function() {
        didLong = false;
      };
    }

    function addCellHandlers(td) {
      td.addEventListener('click', function() {
        var tr = td.parentElement;
        if (bulkMode) {
          var chk = tr.querySelector('.row-chk');
          if (chk) {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event('change'));
          }
          return;
        }
        if (tr._didLong && tr._didLong()) {
          tr._clearLong();
          return;
        }
        if (isCellBlurred(td)) {
          td.classList.toggle('peeked');
          return;
        }
        var nb = td.querySelector('.note-btn');
        if (nb) {
          expandNote({
            stopPropagation: function() {}
          }, nb);
          return;
        }
        if (td.classList.contains('expanded')) td.classList.remove('expanded');
        else if (td.scrollWidth > td.clientWidth + 2) td.classList.add('expanded');
      });
    }

    function isCellBlurred(td) {
      if (!blurMode || td.classList.contains('peeked')) return false;
      if (blurMode === 'en') return td.classList.contains('col-en') || td.classList.contains('col-ro') || td.classList.contains('col-no') || td.classList.contains('col-ca');
      if (blurMode === 'kh') return td.classList.contains('col-kh') || td.classList.contains('col-ro') || td.classList.contains('col-no') || td.classList.contains('col-ca');
      return false;
    }

    function expandNote(e, btn) {
      e.stopPropagation();
      var td = btn.parentElement,
        sh = td.querySelector('.note-short'),
        fu = td.querySelector('.note-full');
      if (!sh || !fu) return;
      var open = fu.style.display !== 'none';
      sh.style.display = open ? '' : 'none';
      fu.style.display = open ? 'none' : '';
      btn.textContent = open ? '▾' : '▴';
      td.classList.toggle('expanded', !open);
    }

    var _editCats = [];
    function renderEditCatPicker(sel) {
      var box = el('e-cats');
      if (!box) return;
      sel = sel || [];
      var all = getAllCats().slice();
      sel.forEach(function(c) { if (all.indexOf(c) === -1) all.push(c); });
      box.innerHTML = all.map(function(c) {
        var on = sel.indexOf(c) !== -1;
        return '<button type="button" class="cat-chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-cat="' + esc(c) + '">' + (on ? '✓ ' : '') + esc(c) + '</button>';
      }).join('');
      box.querySelectorAll('.cat-chip').forEach(function(b) {
        b.onclick = function() {
          if (readOnlyMode) return;
          var c = b.getAttribute('data-cat'), i = _editCats.indexOf(c);
          if (i === -1) _editCats.push(c);
          else if (_editCats.length > 1) _editCats.splice(i, 1);
          else { toast('A word needs at least one category.', 'inf'); return; }
          renderEditCatPicker(_editCats);
        };
      });
    }

    function openEditSheet(row) {
      editRow = row;
      var een = el('e-en'),
        ept = el('e-kh'),
        ero = el('e-ro'),
        eno = el('e-no');
      if (een) een.value = row.english || '';
      if (ept) ept.value = row.khmer || '';
      if (ero) ero.value = row.romanization || '';
      if (eno) eno.value = row.notes || '';
      _editCats = getWordCategories(row).filter(function(c) { return c !== 'Uncategorized'; });
      if (!_editCats.length) _editCats = ['Words'];
      renderEditCatPicker(_editCats);
      var starBtn = el('sheet-star');
      if (starBtn) starBtn.classList.toggle('fav', isFav(row));
      var addOtherBtn = el('add-from-other-btn');
      if (addOtherBtn) addOtherBtn.style.display = readOnlyMode ? 'block' : 'none';
      var titleEl = el('sheet-title');
      if (titleEl) titleEl.textContent = readOnlyMode ? '👁 Word Details' : '✏️ Edit Entry';
      el('sovl').classList.add('open');
    }

    function closeSheet() {
      el('sovl').classList.remove('open');
      editRow = null;
      if (_editFromCard) {
        _editFromCard = false;
        if (studyDeck[studyIdx] && !matchActive) showCard();
      }
    }

    function sovlBg(e) {
      if (e.target === el('sovl')) closeSheet();
    }

    function saveEdit() {
      if (!editRow || readOnlyMode) {
        if (readOnlyMode) toast('Read-only mode.', 'err');
        return;
      }
      if (!SCRIPT_URL) {
        toast('Connect your sheet in ⚙️ first.', 'err');
        return;
      }

      if (!editRow.rowIndex && !editRow.id) {
        toast('Word not yet synced to sheet — wait a moment then try again.', 'inf');
        return;
      }
      var en = (el('e-en').value || '').trim(),
        kh = (el('e-kh').value || '').trim();
      var ro = (el('e-ro').value || '').trim(),
        no = (el('e-no').value || '').trim();
      editRow.english = en;
      editRow.khmer = kh;
      editRow.romanization = ro;
      editRow.notes = no;
      setWordCategories(editRow, _editCats.slice());
      var cat = editRow.category;

      var _queueItem = {
        id: editRow.id || '',
        rowIndex: editRow.rowIndex || '',
        english: en,
        khmer: kh,
        romanization: ro,
        notes: no,
        category: cat,
        categories: editRow.categories.slice(),
        tab: CURRENT_USER || MAIN_USER,
        user: CURRENT_USER || MAIN_USER
      };

      saveCache(allRows);
      render();
      renderFav();
      closeSheet();

      setStatus('imp', '1 edit saving\u2026');
      setBusy(1);
      _editQueue.push(_queueItem);
      _editBatchTotal++;
      processEditQueue();
    }

    var _editQueue = [];
    var _editQueueRunning = false;
    var _editBatchTotal = 0;

    function processEditQueue() {
      if (_editQueueRunning || !_editQueue.length || !SCRIPT_URL) return;
      _editQueueRunning = true;
      var rem = _editQueue.length;
      if (rem > 1) setStatus('imp', rem + ' edits saving\u2026');
      var item = _editQueue[0];
      var url = new URL(SCRIPT_URL);
      url.searchParams.set('action', 'updateWord');
      ['english', 'khmer', 'romanization', 'notes', 'category', 'rowIndex'].forEach(function(f) {
        url.searchParams.set(f, item[f] || '');
      });
      url.searchParams.set('id', item.id || '');
      url.searchParams.set('tab', item.tab || '');
      url.searchParams.set('user', item.user || '');
      fetch(url.toString()).then(function(r) {
        return r.json();
      }).then(function(j) {
        setBusy(-1);
        _editQueueRunning = false;
        if (!j.success) throw new Error(j.error || 'Error');
        _editQueue.shift();
        if (_editQueue.length > 0) {
          setTimeout(processEditQueue, 50);
        } else {
          setStatus('ok', allRows.length + ' words');
          toast('✓ ' + _editBatchTotal + ' edit' + (_editBatchTotal !== 1 ? 's' : '') + ' saved!', 'ok');
          _editBatchTotal = 0;
        }
      }).catch(function(err) {
        setBusy(-1);
        _editQueueRunning = false;
        setStatus('err', 'Edit save failed');
        toast('Edit failed — retrying in 5s…', 'err');
        setTimeout(processEditQueue, 5000);
      });
    }

    function setAddLoading(v) {
      var btn = el('add-btn'),
        lbl = el('add-lbl'),
        sp = el('add-spin');
      if (btn) btn.disabled = v;
      if (lbl) lbl.style.display = v ? 'none' : '';
      if (sp) sp.style.display = v ? '' : 'none';
    }

    function setEditLoading(v) {
      var btn = el('edit-btn'),
        lbl = el('edit-lbl'),
        sp = el('edit-spin');
      if (btn) btn.disabled = v;
      if (lbl) lbl.textContent = v ? 'Saving\u2026' : '\uD83D\uDCBE Save to Sheet';
      if (sp) sp.style.display = 'none';
    }

    function deleteEntry() {
      if (!editRow || readOnlyMode) return;
      if (!confirm('Delete this entry?')) return;
      var rowToDelete = editRow;
      var k = wordKey(rowToDelete);
      allRows = allRows.filter(function(r) {
        return wordKey(r) !== k;
      });
      favorites.delete(k);
      saveFavorites();
      saveCache(allRows);
      render();
      renderFav();
      renderProgress();
      closeSheet();
      if (SCRIPT_URL && rowToDelete.id) {
        enqueueDeletes([rowToDelete.id], CURRENT_USER || MAIN_USER);
        toast('Deleted.', 'ok');
      } else {
        setStatus('ok', allRows.length + ' words');
        toast('Deleted.', 'ok');
      }
    }

    // ── Add words to YOUR OWN sheet, no matter whose sheet you are viewing ──
    // Always targets MAIN_USER. Skips words already on your sheet or already queued.
    // Returns { added, skipped }.
    function addWordsToMySheet(words) {
      if (!MAIN_USER) { toast('Not signed in.', 'err'); return { added: 0, skipped: 0 }; }
      if (!SCRIPT_URL) { toast('Connect your sheet in ⚙️ first.', 'err'); return { added: 0, skipped: 0 }; }
      var mine = readOnlyMode ? (_myRowsSnapshot || safeJsonParse(ls(CACHE_KEY), [])) : allRows;
      var keyOf = function(w) { return (w.khmer || '').trim() + '|' + (w.english || '').trim().toLowerCase(); };
      var seen = {};
      var seenKh = {};
      mine.forEach(function(r) { seen[keyOf(r)] = 1; var k0 = (r.khmer || '').trim(); if (k0) seenKh[k0] = 1; });
      pendingQueue.forEach(function(q) { seen[keyOf(q)] = 1; var k0 = (q.khmer || '').trim(); if (k0) seenKh[k0] = 1; });
      var added = 0, skipped = 0;
      (words || []).forEach(function(w, i) {
        var en = (w.english || '').trim(), kh = (w.khmer || '').trim();
        if (!en && !kh) { skipped++; return; }
        var k = keyOf({ english: en, khmer: kh });
        if (seen[k] || (kh && seenKh[kh])) { skipped++; return; }
        seen[k] = 1;
        if (kh) seenKh[kh] = 1;
        var cat = (w.category || 'Words').trim() || 'Words';
        var item = {
          english: en,
          khmer: kh,
          romanization: (w.romanization || '').trim(),
          notes: (w.notes || '').trim(),
          category: cat,
          tab: MAIN_USER,
          user: MAIN_USER,
          reqId: 'R' + Date.now() + '_' + i + '_' + Math.floor(Math.random() * 99999),
          dateAdded: nowKH()
        };
        if (readOnlyMode) {
          if (_myRowsSnapshot) _myRowsSnapshot.unshift(Object.assign({}, item, { rowIndex: 0 }));
        } else {
          allRows.unshift(Object.assign({}, item, { rowIndex: 0 }));
        }
        pendingQueue.push(item);
        added++;
      });
      if (added) {
        if (!readOnlyMode) { saveCache(allRows); render(); renderFav(); renderProgress(); }
        else if (_myRowsSnapshot) { try { lsSet(CACHE_KEY, JSON.stringify(_myRowsSnapshot)); } catch (e) {} }
        savePendingQueue();
        for (var t = 0; t < added; t++) trackWeeklyAdd();
        recordReport({ added: added });
        // Burglar: words borrowed from someone else's sheet (was never counted before)
        var borrowed = (words || []).filter(function(w) { return w.addedBy && w.addedBy !== MAIN_USER; }).length;
        if (readOnlyMode || borrowed) {
          lsSet(BURGLAR_KEY, String((parseInt(ls(BURGLAR_KEY) || '0', 10)) + Math.min(added, readOnlyMode ? added : borrowed)));
          checkAndUnlock('burglar');
        }
        checkAndUnlock('first_contact');
        checkAndUnlock('word_hoarder');
        checkAndUnlock('broad_learner');
        checkAndUnlock('organiser');
        triggerSaveState();
        processPendingQueue();
      }
      if (added && skipped) toast('➕ ' + added + ' added to your sheet · ' + skipped + ' already there', 'ok');
      else if (added) toast('➕ ' + added + ' word' + (added !== 1 ? 's' : '') + ' added to your sheet!', 'ok');
      else if (skipped) toast('Already on your sheet.', 'inf');
      return { added: added, skipped: skipped };
    }

    function addWordFromOtherSheet() {
      if (!editRow || !MAIN_USER) {
        toast('Not signed in.', 'err');
        return;
      }
      var row = editRow;
      closeSheet();
      addWordsToMySheet([row]);
    }

    function bulkAddToMySheet() {
      if (!selectedKeys.size) {
        toast('Select some entries first.', 'err');
        return;
      }
      var keys = selectedKeys;
      var rows = allRows.filter(function(r) { return keys.has(wordKey(r)); });
      addWordsToMySheet(rows);
      exitBulk();
    }

    var _isSubmittingWord = false;
    function submitAdd(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (readOnlyMode) {
        toast('Read-only mode.', 'err');
        return;
      }
      var _nowSub = Date.now();
      if (_nowSub - (window._lastAddSubmitAt || 0) < 700) return; // debounce double-taps / Enter repeats
      window._lastAddSubmitAt = _nowSub;
      if (_isSubmittingWord || submitLock) {
        toast('Adding in progress — please wait a moment.', 'inf');
        return;
      }
      _isSubmittingWord = true;
      setAddLoading(true);
      var btn = el('add-btn');
      if (btn) btn.disabled = true;
      var en = (el('f-en').value || '').trim(),
        kh = (el('f-kh').value || '').trim();
      if (!SCRIPT_URL) {
        toast('Connect your sheet in ⚙️ first.', 'err');
        setAddLoading(false);
        _isSubmittingWord = false;
        var b2 = el('add-btn'); if (b2) b2.disabled = false;
        return;
      }
      var alreadyQueued = pendingQueue.some(function(q) {
        return q.english === en && q.khmer === kh;
      });
      if (alreadyQueued) {
        toast('Already queued — will sync shortly!', 'inf');
        setAddLoading(false);
        _isSubmittingWord = false;
        var b0 = el('add-btn'); if (b0) b0.disabled = false;
        return;
      }
      var alreadyLocal = allRows.some(function(r) {
        var enMatch = en ? (r.english || '').trim().toLowerCase() === en.toLowerCase() : true;
        var khMatch = kh ? (r.khmer || '').trim() === kh : true;
        return (en && kh) ? (enMatch && khMatch) : (en ? enMatch : khMatch);
      });
      if (alreadyLocal) {
        toast('This word is already in your list!', 'inf');
        setAddLoading(false);
        _isSubmittingWord = false;
        var b1 = el('add-btn'); if (b1) b1.disabled = false;
        return;
      }
      var ro = (el('f-ro').value || '').trim(),
        no = (el('f-no').value || '').trim(),
        cat = (el('f-cat') || {}).value || 'Words';
      var item = {
        english: en,
        khmer: kh,
        romanization: ro,
        notes: no,
        category: cat,
        tab: CURRENT_USER || MAIN_USER,
        user: CURRENT_USER || MAIN_USER,
        reqId: 'R' + Date.now() + '_' + Math.floor(Math.random() * 99999),
        dateAdded: nowKH()
      };
      allRows.unshift(Object.assign({}, item, {
        rowIndex: 0
      }));
      saveCache(allRows);
      el('add-form').reset();
      populateCatDropdown('f-cat', false, 'Words');
      var notice = el('add-notice');
      if (notice) {
        notice.textContent = '✓ Word queued — safe to add another!';
        notice.style.display = 'block';
        clearTimeout(window._noticeTimer);
        window._noticeTimer = setTimeout(function() {
          notice.style.display = 'none';
        }, 4000);
      }
      render();
      renderFav();
      renderProgress();
      setAddLoading(false);
      trackWeeklyAdd();
      recordReport({ added: 1 });
      checkAndUnlock('broad_learner');
      checkAndUnlock('organiser');
      checkAndUnlock('word_hoarder');
      checkAndUnlock('first_contact');
      submitLock = true;
      _isSubmittingWord = false;
      var btnAdd = el('add-btn');
      if (btnAdd) btnAdd.disabled = false;
      if (submitLockTimer) clearTimeout(submitLockTimer);
      submitLockTimer = setTimeout(function() {
        submitLock = false;
      }, 1000);
      pendingQueue.push(item);
      savePendingQueue();
      triggerSaveState();
      processPendingQueue();
    }

    function saveSrs() {
      lsSet(SRS_KEY, JSON.stringify(srsData));
    }

    // ── SM-2 spaced repetition ──
    // Stored shape (unchanged field names so old data keeps working):
    //   { interval (days), reps, ease, nextReview (ms|null), dueDate (ms|null), lastReview, sm2: 1 }
    // Legacy entries ({interval, reps, ease, nextReview} from the old fixed 1/3/×ease scheme)
    // are upgraded in place on first read — nothing is reset.
    var SM2_MIN_EASE = 1.3, SM2_DEFAULT_EASE = 2.5, DAY_MS = 86400000;

    function normalizeSrsEntry(d) {
      if (!d || typeof d !== 'object') d = {};
      if (d.sm2 === 1) return d;
      var reps = parseInt(d.reps, 10);
      if (isNaN(reps) || reps < 0) reps = 0;
      var interval = parseFloat(d.interval);
      if (isNaN(interval) || interval < 0) interval = 0;
      var ease = parseFloat(d.ease);
      if (isNaN(ease) || ease <= 0) {
        // Derive a starting ease from history: long intervals relative to reps mean easy recall
        ease = 2.5;
        if (reps >= 3 && interval > 0) ease = Math.min(3.0, Math.max(1.3, Math.pow(interval / 3, 1 / Math.max(1, reps - 2))));
      }
      ease = Math.max(1.3, Math.min(3.0, ease));
      var due = d.dueDate != null ? Number(d.dueDate) : (d.nextReview != null ? Number(d.nextReview) : null);
      if (due !== null && isNaN(due)) due = null;
      // Old card with history but no timestamp → due now rather than "new"
      if (due === null && (reps > 0 || interval > 0)) due = Date.now();
      d.reps = reps;
      d.interval = interval;
      d.ease = Math.round(ease * 100) / 100;
      d.nextReview = due;
      d.dueDate = due;
      if (d.lastReview == null && due !== null && interval > 0) d.lastReview = due - interval * 86400000;
      d.sm2 = 1;
      return d;
    }

    function getSrsEntry(k) {
      srsData[k] = normalizeSrsEntry(srsData[k] || { interval: 0, reps: 0, ease: SM2_DEFAULT_EASE, nextReview: null });
      return srsData[k];
    }

    // App ratings → SM-2 quality: 0 Didn't know → 1, 1 Kind of → 3, 2 Got it → 5
    function sm2Quality(rating) { return rating === 2 ? 5 : rating === 1 ? 3 : 1; }

    function sm2Schedule(d, q, now) {
      if (q < 3) {
        d.reps = 0;
        d.interval = 0;              // relearn: show again this session/today
        d.nextReview = now + 10 * 60000;
      } else {
        d.reps++;
        if (d.reps === 1) d.interval = 1;
        else if (d.reps === 2) d.interval = 6;
        else d.interval = Math.max(1, Math.round((d.interval || 1) * d.ease));
        d.nextReview = now + d.interval * DAY_MS;
      }
      d.ease = Math.max(SM2_MIN_EASE, Math.round((d.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))) * 100) / 100);
      d.dueDate = d.nextReview;
      d.lastReview = now;
      return d;
    }

    function updateSrs(k, rating) {
      var d = getSrsEntry(k);
      srsData[k] = sm2Schedule(d, sm2Quality(rating), Date.now());
      saveSrs();
    }

    function srsDueAt(k) {
      var d = srsData[k];
      if (!d) return null;
      var v = d.dueDate != null ? d.dueDate : d.nextReview;
      return v == null ? null : Number(v);
    }

    function isSrsDue(k) {
      var t = srsDueAt(k);
      if (t === null || isNaN(t)) return true;
      return Date.now() >= t;
    }

    // Reviewed cards whose due date has arrived (excludes never-studied cards)
    function isSrsReviewDue(k) {
      var t = srsDueAt(k);
      return t !== null && !isNaN(t) && t <= Date.now();
    }

    function countDueToday() {
      var now = Date.now(), n = 0;
      for (var i = 0; i < allRows.length; i++) {
        var t = srsDueAt(wordKey(allRows[i]));
        if (t !== null && !isNaN(t) && t <= now) n++;
      }
      return n;
    }

    function updateDueTodayBtn() {
      var b = el('due-today-btn');
      if (!b) return;
      var n = readOnlyMode ? 0 : countDueToday();
      b.textContent = '📅 Due Today (' + n + ')';
      b.disabled = n === 0;
    }

    function studyDueToday() {
      var pf = el('study-preset-filter');
      if (!pf) return;
      if (![].some.call(pf.options, function(o) { return o.value === '__duetoday__'; })) {
        var o = document.createElement('option');
        o.value = '__duetoday__';
        o.textContent = '📅 Due Today';
        pf.appendChild(o);
      }
      pf.value = '__duetoday__';
      var cf = el('study-conf-filter');
      if (cf) cf.value = 'all';
      onStudyCatChange('preset');
      initStudy();
    }

    function countDue() {
      return allRows.filter(function(r) {
        return isSrsDue(wordKey(r));
      }).length;
    }

    var studyDeck = [],
      studyIdx = 0,
      pendingMcRating = null,
      cardFlipped = false,
      sessionK = 0,
      sessionM = 0,
      sessionU = 0;

    function toggleStudyDir() {
      studyDir = (studyDir === 'kh' ? 'en' : 'kh');
      S.studyDir = studyDir;
      lsSet(SKEY, JSON.stringify(S));
      updateDirBtn();
      showCard();
    }

    function updateStudyMethodDescs() {}

    function updateDirBtn() {
      var btn = el('study-dir-btn');
      if (btn) btn.textContent = studyDir === 'kh' ? 'Khmer → English' : 'English → Khmer';
    }

    var _confStudyLevel = null;
    var _confStudyPool = [];

    function buildMcChoices(correct, pool, dir) {
      var wrong = pool.filter(function(x) {
          return x !== correct;
        })
        .sort(function() {
          return Math.random() - .5;
        }).slice(0, 3);
      if (wrong.length < 3) {
        var extra = allRows.filter(function(x) {
          return x !== correct && pool.indexOf(x) === -1;
        }).sort(function() {
          return Math.random() - .5;
        });
        wrong = wrong.concat(extra).slice(0, 3);
      }
      var choices = wrong.concat([correct]).sort(function() {
        return Math.random() - .5;
      });
      var html = '<div class="mc-choices" onclick="event.stopPropagation()">';
      choices.forEach(function(c) {
        var txt = dir === 'kh' ? (c.english || '?') : (c.khmer || '?');
        var isCorr = c === correct;
        html += '<button class="mc-btn" data-corr="' + (isCorr ? '1' : '0') + '" onclick="mcSelect(this)">' + esc(txt) + '</button>';
      });
      html += '</div>';
      return html;
    }

    function mcSelect(btn) {
      if (cardFlipped) return;
      cardFlipped = true;
      var isCorr = btn.dataset.corr === '1';
      document.querySelectorAll('.mc-btn').forEach(function(b) {
        b.disabled = true;
        if (b.dataset.corr === '1') b.classList.add('mc-ok');
        else if (b === btn && !isCorr) b.classList.add('mc-bad');
      });
      pendingMcRating = isCorr ? 2 : 0;
    }

    function addFromTranslation(en, kh, ro, cat) {
      if (readOnlyMode) { // the Add page is locked while viewing someone else — add straight to your sheet
        addWordsToMySheet([{ english: en || '', khmer: kh || '', romanization: ro || '', category: cat || '' }]);
        return;
      }
      goPage('add', 'nav-add');
      var fe = el('f-en');
      if (fe) fe.value = en || '';
      var fk = el('f-kh');
      if (fk) fk.value = kh || '';
      var fr = el('f-ro');
      if (fr) fr.value = ro || '';
      var fc = el('f-cat');
      if (fc && cat && getAllCats().indexOf(cat) !== -1) fc.value = cat;
      toast('Word pre-filled — review and send! ✓', 'ok');
    }

    // Shared save routine: native File System Access picker when available,
    // otherwise an <a download> fallback. Returns 'saved' | 'downloaded' | 'cancelled'.
    async function saveFileWithPicker(content, filename, mime, description) {
      var blob = content instanceof Blob ? content : new Blob([content], { type: mime });
      var ext = (filename.match(/\.[a-z0-9]+$/i) || ['.txt'])[0];
      if (typeof window.showSaveFilePicker === 'function') {
        try {
          var accept = {}; accept[mime.split(';')[0]] = [ext];
          var handle = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: description || 'File', accept: accept }] });
          var w = await handle.createWritable();
          await w.write(blob);
          await w.close();
          return 'saved';
        } catch (e) {
          if (e && e.name === 'AbortError') return 'cancelled';
          // SecurityError / NotAllowedError (e.g. inside iframes) -> fall through to download
        }
      }
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = filename; a.rel = 'noopener'; a.style.display = 'none';
      document.body.appendChild(a); a.click();
      setTimeout(function() { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1000);
      return 'downloaded';
    }

    // Report dates: MM/DD/YYYY so any truncation only clips the trailing year.
    function fmtRepDate(d) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d || ''));
      return m ? m[2] + '/' + m[3] + '/' + m[1] : String(d || '');
    }

    async function exportAllData() {
      var data = {
        _version: 2,
        _appVersion: APP_VERSION,
        _exportedAt: nowKH(),
        _user: MAIN_USER,
        _exportedDeviceKeys: [],
        _fullLocalStorage: {}
      };
      // Only app-owned keys: vocabulary cache, SRS, study history, settings, favourites,
      // audio cache, etc. Everything this app writes uses the "kv_" prefix.
      // Credentials / connection details and other sites' data are never exported.
      var _EXPORT_EXCLUDE = [URL_KEY, MAINUSER_KEY, USERDATA_SYNC_KEY, USERS_CACHE_KEY, DEL_QUEUE_KEY, QUEUE_KEY];
      var _isAppKey = function(k) {
        if (_EXPORT_EXCLUDE.indexOf(k) !== -1) return false;
        if (/cred|pass|token|secret/i.test(k)) return false;
        return k.indexOf('kv_') === 0;
      };
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && _isAppKey(k)) {
            var val = localStorage.getItem(k);
            data._fullLocalStorage[k] = val;
            data._exportedDeviceKeys.push(k);
            if (val !== null && val !== undefined) data[k] = val;
          }
        }
      } catch (e) {
        console.warn('Export all local data fallback', e);
      }
      var EXPORT_KEYS = [
        SKEY, FAV_KEY, CONF_KEY, SRS_KEY, CATS_KEY, CAT_ORDER_KEY,
        SETS_KEY, ACHV_KEY, STREAK_KEY, COMEBACK_KEY, WEEKLY_ADD_KEY,
        BURGLAR_KEY, EXPLORER_KEY, THEME_KEY, TAB_ORDER_KEY, COL_WIDTHS_KEY,
        DELETED_CATS_KEY, BEST_STREAK_KEY, 'kv_reset_btn',
        EARLY_BIRD_KEY, NIGHT_OWL_KEY, COMPETITIVE_KEY,
        CACHE_KEY, SYNC_KEY, 'kv_daily_moves', REPORTS_KEY, 'kv_view_cat', 'kv_view_conf',
        'kv_study_len', 'kv_dict_history', 'kv_user_stats', NOTEBOOK_KEY, '__kv_trans_history'
      ];
      EXPORT_KEYS.forEach(function(k) {
        var v = ls(k);
        if (v !== null && v !== undefined && v !== '' && !(k in data) && _EXPORT_EXCLUDE.indexOf(k) === -1) data[k] = v;
      });
      var json = JSON.stringify(data, null, 2);
      var filename = 'khmer-vocab-backup-' + todayKH() + '.json';
      var res = await saveFileWithPicker(json, filename, 'application/json;charset=utf-8', 'JSON Backup');
      if (res === 'cancelled') return;
      toast(res === 'saved' ? 'Backup saved ✓ (words stay on your sheet)' : 'Backup downloaded ✓ (words stay on your sheet)', 'ok');
    }

    function importAllData() {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          try {
            var data = JSON.parse(ev.target.result);
            var count = 0;
            var SAFE_KEYS = [SKEY, FAV_KEY, CONF_KEY, SRS_KEY, CATS_KEY, CAT_ORDER_KEY,
              SETS_KEY, ACHV_KEY, STREAK_KEY, COMEBACK_KEY, WEEKLY_ADD_KEY,
              BURGLAR_KEY, EXPLORER_KEY, THEME_KEY, TAB_ORDER_KEY, COL_WIDTHS_KEY,
              DELETED_CATS_KEY, BEST_STREAK_KEY, 'kv_reset_btn',
              EARLY_BIRD_KEY, NIGHT_OWL_KEY, COMPETITIVE_KEY, REPORTS_KEY, 'kv_daily_moves', NOTEBOOK_KEY, '__kv_trans_history'
            ];
            Object.keys(data).forEach(function(k) {
              if (k[0] === '_') return;
              if (SAFE_KEYS.indexOf(k) === -1) return;
              try {
                localStorage.setItem(k, data[k]);
                count++;
              } catch (e2) {}
            });
            toast('Imported ' + count + ' items — reload to apply ✓', 'ok');
          } catch (e) {
            toast('Could not read file — is it a valid JSON backup?', 'err');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    }

    function initStudy() {
      populateStudyFilter();
      populateStudyPresetFilter();
      updateDirBtn();
      var selVals = getStudyFilterValues(),
        presetFilter = (el('study-preset-filter') || {}).value || 'none',
        confFilter = (el('study-conf-filter') || {}).value || 'all',
        orderMode = (el('study-order') || {}).value || 'shuffle',
        len = Math.max(1, parseInt((el('study-len') || {}).value) || 20);
      var userSel = el('study-filter'),
        presetSel = el('study-preset-filter');
      if (userSel && presetSel) {
        var presetActive = presetFilter !== 'none';
        userSel.classList.toggle('active-sel', !presetActive);
        presetSel.classList.toggle('active-sel', presetActive);
      }
      var pool = allRows.slice();
      if (presetFilter === '__weak__') pool = pool.filter(function(r) {
        var c = confidence[wordKey(r)];
        return c === 0 || c === undefined;
      });
      else if (presetFilter === '__due__') pool = pool.filter(function(r) {
        return isSrsDue(wordKey(r));
      });
      else if (presetFilter === '__duetoday__') pool = pool.filter(function(r) {
        return isSrsReviewDue(wordKey(r));
      }).sort(function(a, b) { return srsDueAt(wordKey(a)) - srsDueAt(wordKey(b)); });
      else if (presetFilter === '__cons__') {
        var _cons = window._refCons || [];
        pool = _cons.map(function(c) {
          return {
            english: c.ro,
            khmer: c.kh,
            romanization: c.ro,
            notes: 'Series ' + (c.s || ''),
            category: 'Consonants',
            id: 'ref_' + c.kh
          };
        });
      } else if (presetFilter === '__depvow__') {
        var _dvs = window._refDepVow || [];
        pool = _dvs.map(function(v) {
          return {
            english: (v.s1 || '') + ' / ' + (v.s2 || ''),
            khmer: v.kh,
            romanization: v.s1 || '',
            notes: v.ex || '',
            category: 'Dep. Vowels',
            id: 'ref_' + v.kh
          };
        });
      } else if (presetFilter === '__indvow__') {
        var _ivs = window._refIndVow || [];
        pool = _ivs.map(function(v) {
          return {
            english: v.ro,
            khmer: v.kh,
            romanization: v.ro,
            notes: '',
            category: 'Ind. Vowels',
            id: 'ref_' + v.kh
          };
        });
      } else if (presetFilter === '__nums__') {
        var _nums = window._refNums || [];
        pool = _nums.map(function(n) {
          return {
            english: String(n.n),
            khmer: n.kh,
            romanization: String(n.n),
            notes: n.word ? ('Word: ' + n.word) : '',
            category: 'Numbers',
            id: 'ref_' + n.n
          };
        });
      } else if (presetFilter.indexOf('set:') === 0) {
        var sid = presetFilter.slice(4),
          sset = studySets.find(function(st) {
            return st.id === sid;
          });
        if (sset) { var _sk = new Set(sset.keys); pool = pool.filter(function(r) {
          return _sk.has(wordKey(r));
        }); }
        else pool = [];
      } else if (selVals.indexOf('All') === -1) {
        pool = pool.filter(function(r) {
          var rc = getWordCategories(r);
          for (var i = 0; i < selVals.length; i++) {
            var v = selVals[i];
            if (v === '__fav__') {
              if (isFav(r)) return true;
            } else if (v === '__nosent__') {
              if (rc.indexOf('Sentences') === -1) return true;
            } else if (rc.indexOf(v) !== -1) return true;
          }
          return false;
        });
      }
      if (orderMode === 'weak' || orderMode === 'strong') {
        pool.sort(function(a, b) {
          var d = confRankVal(a) - confRankVal(b);
          if (orderMode === 'strong') d = -d;
          if (d) return d;
          return Math.random() - .5;
        });
      } else if (S.srs) {
        pool.sort(function(a, b) {
          var ad = isSrsDue(wordKey(a)) ? 0 : 1,
            bd = isSrsDue(wordKey(b)) ? 0 : 1;
          if (ad !== bd) return ad - bd;
          return Math.random() - .5;
        });
      } else pool.sort(function() {
        return Math.random() - .5;
      });
      if (S.favBoost) {
        pool = pool.map(function(r, i) {
          return {
            r: r,
            w: (isFav(r) ? 0.45 : 1) * (i + 1)
          };
        }).sort(function(x, y) {
          return x.w - y.w;
        }).map(function(o) {
          return o.r;
        });
      }

      if (confFilter === 'got') pool = pool.filter(function(r) {
        return confidence[wordKey(r)] === 2;
      });
      else if (confFilter === 'kinda') pool = pool.filter(function(r) {
        return confidence[wordKey(r)] === 1;
      });
      else if (confFilter === 'unknown') pool = pool.filter(function(r) {
        return confidence[wordKey(r)] === 0;
      });
      else if (confFilter === 'unstudied') pool = pool.filter(function(r) {
        return confidence[wordKey(r)] === undefined;
      });
      else if (confFilter === 'weak') pool = pool.filter(function(r) {
        var c = confidence[wordKey(r)];
        return c === 0 || c === undefined;
      });
      studyDeck = pool.slice(0, len);
      studyIdx = 0;
      cardFlipped = false;
      hideMatchPanel();
      pendingMcRating = null;
      sessionK = 0;
      sessionM = 0;
      sessionU = 0;
      var ss = el('session-summary'),
        sn = el('study-nav'),
        se = el('study-empty'),
        fc = el('flashcard'),
        fsb = el('fc-speak-btn');
      if (ss) ss.style.display = 'none';
      if (sn) sn.style.display = 'flex';
      if (se) se.style.display = studyDeck.length === 0 ? 'block' : 'none';
      if (fc) fc.style.display = studyDeck.length === 0 ? 'none' : 'flex';
      if (fsb) fsb.style.display = studyDeck.length > 0 ? 'block' : 'none';
      updateDueTodayBtn();
      if (_studySessionActive) flushStudySync(); // previous unfinished session
      _studySessionActive = studyDeck.length > 0 && !readOnlyMode;
      if (studyDeck.length > 0) showCard();
      else updateCardStar();
    }

    function showCard() {
      stopAllAudio();
      var r = studyDeck[studyIdx];
      if (!r) return;
      cardFlipped = false;
      var cb = el('conf-btns'),
        sn = el('study-nav');
      if (cb) cb.style.display = 'none';
      if (sn) sn.style.display = 'flex';
      var k = wordKey(r),
        srsBadge = '';
      if (S.srs) {
        var se = srsData[k];
        if (!se || se.nextReview === null) srsBadge = '<span class="srs-badge srs-new">New</span>';
        else if (isSrsDue(k)) srsBadge = '<span class="srs-badge srs-due">Due</span>';
        else srsBadge = '<span class="srs-badge srs-review">Review</span>';
      }
      var cfb = el('fc-conf-badge');
      if (cfb) {
        var cf = confidence[k];
        if (cf !== undefined) {
          cfb.style.display = '';
          cfb.className = 'fc-conf-badge' + (cf === 2 ? ' conf-k-bg' : cf === 1 ? ' conf-m-bg' : ' conf-u-bg');
          cfb.textContent = cf === 2 ? '✓ Know' : cf === 1 ? '~ Kinda' : '✗ Unknown';
        } else cfb.style.display = 'none';
      }
      var cbdg = el('fc-badge');
      if (cbdg) cbdg.innerHTML = getWordCategories(r).map(function(c) { return '<span class="badge ' + bCls(c) + '">' + esc(c) + '</span>'; }).join(' ');
      var html = '';
      if (studyDir === 'kh') {
        html += srsBadge + '<div class="fc-kh kh">' + esc(r.khmer || '?') + '</div>';
        html += S.mc ? buildMcChoices(r, studyDeck, 'kh') : '<div class="fc-hint">Tap to reveal English</div>';
      } else {
        html += srsBadge + '<div class="fc-en">' + esc(r.english || '?') + '</div>';
        html += S.mc ? buildMcChoices(r, studyDeck, 'en') : '<div class="fc-hint">Tap to reveal Khmer</div>';
      }
      var fcc = el('fc-content');
      if (fcc) fcc.innerHTML = html;
      updateCardStar();
      var pct = studyDeck.length ? Math.round(studyIdx / studyDeck.length * 100) : 0;
      var spf = el('spf');
      if (spf) spf.style.width = pct + '%';
      var sp = el('study-prog');
      if (sp) sp.textContent = (studyIdx + 1) + ' / ' + studyDeck.length;
    }

    function updateCardStar() {
      var b = el('fc-star-btn');
      if (!b) return;
      var r = studyDeck[studyIdx];
      var on = r ? isFav(r) : false;
      b.textContent = on ? '\u2B50' : '\u2606';
      b.classList.toggle('on', !!on);
      b.title = on ? 'Remove from favourites' : 'Add to favourites';
    }

    function toggleCardFav(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var r = studyDeck[studyIdx];
      if (!r) return;
      toggleFav(r);
      updateCardStar();
      toast(isFav(r) ? 'Added to favourites \u2B50' : 'Removed from favourites', 'ok');
    }

    var _editFromCard = false;
    function editCurrentCard(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var r = studyDeck[studyIdx];
      if (!r) return;
      stopAllAudio();
      if (document.fullscreenElement || document.webkitFullscreenElement) exitAnyFullscreen();
      _editFromCard = true;
      openEditSheet(r);
    }

    function toggleCardFullscreen(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var st = el('fc-stage');
      if (!st) return;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        var req = st.requestFullscreen || st.webkitRequestFullscreen;
        if (req) {
          var pr = req.call(st);
          if (pr && pr.catch) pr.catch(function() {
            toast('Full screen not supported here.', 'inf');
          });
        } else toast('Full screen not supported here.', 'inf');
      } else {
        var ex = document.exitFullscreen || document.webkitExitFullscreen;
        if (ex) {
          var pe = ex.call(document);
          if (pe && pe.catch) pe.catch(function() {});
        }
      }
    }

    function exitAnyFullscreen(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      var ex = document.exitFullscreen || document.webkitExitFullscreen;
      if (ex && (document.fullscreenElement || document.webkitFullscreenElement)) {
        var pe = ex.call(document);
        if (pe && pe.catch) pe.catch(function() {});
      }
    }

    function _updateCardFsBtn() {
      var st = el('fc-stage'),
        b = el('fc-fs-btn');
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      var on = !!(st && fsEl === st);
      if (st) st.classList.toggle('fc-stage-fs', on);
      var sxf = el('ss-exit-fs'), ssum = el('session-summary');
      if (sxf) sxf.style.display = (fsEl && ssum && ssum.style.display !== 'none') ? 'flex' : 'none';
      // Leaving full screen: put the summary back in its normal place
      if (!fsEl && ssum && st && ssum.parentElement === st && st.parentElement) st.parentElement.insertBefore(ssum, st.nextSibling);
      if (b) {
        b.textContent = on ? '\u2715' : '\u26F6';
        b.title = on ? 'Exit full screen' : 'Full screen flashcards';
      }
    }

    var matchBuffer = [],
      matchActive = false,
      matchPick = null,
      matchDone = 0;

    function hideMatchPanel() {
      var p = el('match-panel');
      if (p) p.style.display = 'none';
      matchActive = false;
      matchBuffer = [];
      matchPick = null;
      matchDone = 0;
    }

    function showMatchPanel() {
      var panel = el('match-panel');
      var cards = matchBuffer.slice(-5);
      if (!panel || cards.length < 2) {
        hideMatchPanel();
        return false;
      }
      matchActive = true;
      matchPick = null;
      matchDone = 0;
      var fc = el('flashcard'),
        cb = el('conf-btns'),
        sn = el('study-nav'),
        fsb = el('fc-speak-btn');
      if (fc) fc.style.display = 'none';
      if (cb) cb.style.display = 'none';
      if (sn) sn.style.display = 'none';
      if (fsb) fsb.style.display = 'none';
      panel.style.display = 'block';
      var khCol = el('match-col-kh'),
        enCol = el('match-col-en');
      if (!khCol || !enCol) {
        hideMatchPanel();
        return false;
      }
      khCol.innerHTML = '';
      enCol.innerHTML = '';
      var total = cards.length;

      function mk(col, r, side) {
        var b = document.createElement('button');
        b.className = 'match-btn' + (side === 'kh' ? ' match-kh kh' : '');
        b.textContent = side === 'kh' ? (r.khmer || '?') : (r.english || '?');
        b.setAttribute('data-mk', wordKey(r));
        b.addEventListener('click', function() {
          // Tapping a Khmer tile always pronounces it
          if (side === 'kh' && r.khmer) speakKhmer(r.khmer);
          onMatchPick(b, side, total);
        });
        col.appendChild(b);
      }
      cards.slice().sort(function() {
        return Math.random() - .5;
      }).forEach(function(r) {
        mk(khCol, r, 'kh');
      });
      cards.slice().sort(function() {
        return Math.random() - .5;
      }).forEach(function(r) {
        mk(enCol, r, 'en');
      });
      var st = el('match-status');
      if (st) st.textContent = '0 / ' + total + ' matched';
      return true;
    }

    function onMatchPick(btn, side, total) {
      if (!btn || btn.classList.contains('matched')) return;
      if (matchPick && matchPick.btn === btn) {
        btn.classList.remove('sel');
        matchPick = null;
        return;
      }
      if (matchPick && matchPick.side === side) {
        matchPick.btn.classList.remove('sel');
        matchPick = {
          btn: btn,
          side: side
        };
        btn.classList.add('sel');
        return;
      }
      if (!matchPick) {
        matchPick = {
          btn: btn,
          side: side
        };
        btn.classList.add('sel');
        return;
      }
      var a = matchPick.btn,
        b = btn;
      matchPick = null;
      a.classList.remove('sel');
      if (a.getAttribute('data-mk') === b.getAttribute('data-mk')) {
        a.classList.add('matched');
        b.classList.add('matched');
        matchDone++;
        var st = el('match-status');
        if (st) st.textContent = matchDone + ' / ' + total + ' matched';
        if (matchDone >= total) setTimeout(function() {
          finishMatch();
        }, 500);
      } else {
        a.classList.add('bad');
        b.classList.add('bad');
        setTimeout(function() {
          a.classList.remove('bad');
          b.classList.remove('bad');
        }, 430);
      }
    }

    function finishMatch(skipped) {
      var panel = el('match-panel');
      if (panel) panel.style.display = 'none';
      matchActive = false;
      matchBuffer = [];
      matchPick = null;
      matchDone = 0;
      var fc = el('flashcard'),
        fsb = el('fc-speak-btn');
      if (fc) fc.style.display = studyDeck.length === 0 ? 'none' : 'flex';
      if (fsb) fsb.style.display = studyDeck.length > 0 ? 'block' : 'none';
      if (!skipped) toast('Nice \u2014 all matched \u2713', 'ok');
      nextCard();
    }

    function applyStudyPrefs() {
      var dtb = el('due-today-btn');
      if (dtb) dtb.classList.toggle('is-hidden', !!S.hideDueTodayBanner);
      var fc = el('flashcard');
      if (fc) fc.classList.toggle('swipe-on', S.swipeStudy !== false);
    }

    // Swipe gestures on the flashcard (toggle: Settings → Study → Flashcard Settings).
    (function() {
      var fc = el('flashcard');
      if (!fc) return;
      var sx = 0, sy = 0, st = 0, tracking = false, swiped = false;
      fc.addEventListener('touchstart', function(e) {
        if (S.swipeStudy === false || matchActive || e.touches.length !== 1) { tracking = false; return; }
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); tracking = true; swiped = false;
      }, { passive: true });
      var THRESH = 60, il = el('fc-swipe-l'), ir = el('fc-swipe-r');
      function setInd() {
        var rate = cardFlipped && !S.mc;
        if (ir) ir.textContent = rate ? '✓ Know' : 'Prev ←';
        if (il) il.textContent = rate ? "✗ Don't Know" : '→ Next';
        fc.classList.toggle('swipe-rate', rate);
      }
      function clearSwipe(spring) {
        fc.classList.remove('swiping', 'swipe-r', 'swipe-l');
        fc.style.setProperty('--sw-p', 0);
        if (spring) {
          fc.classList.add('fc-spring');
          setTimeout(function() { fc.classList.remove('fc-spring'); }, 480);
        }
        fc.style.transform = '';
      }
      fc.addEventListener('touchmove', function(e) {
        if (!tracking) return;
        var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
          if (!fc.classList.contains('swiping')) { setInd(); fc.classList.remove('fc-spring'); fc.classList.add('swiping'); }
          var p = Math.min(1, Math.abs(dx) / THRESH);
          fc.style.setProperty('--sw-p', p.toFixed(3));
          fc.classList.toggle('swipe-r', dx > 0);
          fc.classList.toggle('swipe-l', dx < 0);
          fc.style.transform = 'translateX(' + (dx * 0.55) + 'px) rotate(' + (dx * 0.03) + 'deg)';
        }
      }, { passive: true });
      fc.addEventListener('touchcancel', function() { tracking = false; clearSwipe(true); }, { passive: true });
      fc.addEventListener('touchend', function(e) {
        if (!tracking) return;
        tracking = false;
        var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
        var wasSwiping = fc.classList.contains('swiping');
        if (Math.abs(dx) < THRESH || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - st > 800) { clearSwipe(wasSwiping); if (wasSwiping) swiped = true; return; }
        clearSwipe(false);
        swiped = true;
        if (S.mc) { if (dx < 0) nextCard(); else prevCard(); return; }
        if (cardFlipped) rateCard(dx > 0 ? 2 : 0);
        else if (dx < 0) nextCard();
        else prevCard();
      });
      // a swipe must not also count as a tap-to-flip
      fc.addEventListener('click', function(e) {
        if (swiped) { swiped = false; e.stopImmediatePropagation(); e.preventDefault(); }
      }, true);
    })();

    function flipCard() {
      if (S.mc) return;
      if (cardFlipped) return;
      cardFlipped = true;
      var r = studyDeck[studyIdx];
      if (!r) return;
      var k = wordKey(r),
        srsBadge = '';
      if (S.srs) {
        var se = srsData[k];
        if (!se || se.nextReview === null) srsBadge = '<span class="srs-badge srs-new">New</span>';
        else if (isSrsDue(k)) srsBadge = '<span class="srs-badge srs-due">Due</span>';
        else srsBadge = '<span class="srs-badge srs-review">Review</span>';
      }
      var html = srsBadge;
      if (studyDir === 'kh') {
        html += '<div class="fc-kh kh">' + esc(r.khmer || '') + '</div><div class="fc-en">' + esc(r.english || '') + '</div>';
        if (S.studyRo && r.romanization) html += '<div class="fc-ro">' + esc(r.romanization) + '</div>';
      } else {
        html += '<div class="fc-en">' + esc(r.english || '') + '</div><div class="fc-kh kh">' + esc(r.khmer || '') + '</div>';
        if (S.studyRo && r.romanization) html += '<div class="fc-ro">' + esc(r.romanization) + '</div>';
      }
      if (r.notes) html += '<div class="fc-no">' + esc(r.notes) + '</div>';
      var fcc = el('fc-content');
      if (fcc) fcc.innerHTML = html;
      var cb = el('conf-btns');
      if (cb) cb.style.display = 'flex';
      var sn = el('study-nav');
      if (sn) sn.style.display = 'none';
      stopAllAudio();
      if (r.khmer && S.autoSpeakFlip !== false) speakKhmer(r.khmer);
    }

    function rateCard(rating) {
      var r = studyDeck[studyIdx];
      if (!r) return;
      var k = wordKey(r);
      var prevConf = confidence[k];
      confidence[k] = rating;
      lsSet(CONF_KEY, JSON.stringify(confidence));
      trackConfidenceMovement(prevConf, rating);
      if (S.srs) { updateSrs(k, rating); updateDueTodayBtn(); }
      if (rating === 2 && prevConf === 0) {
        var cc = (parseInt(ls(COMEBACK_KEY) || '0')) + 1;
        lsSet(COMEBACK_KEY, String(cc));
        checkAndUnlock('comeback');
      }
      if (rating === 2) sessionK++;
      else if (rating === 1) sessionM++;
      else sessionU++;
      // Fixed deck count preserved on wrong answer (deck length stays exact)
      if (S.match5) {
        // Only queue for Match 5 if card was answered wrong (0 or 1) or is currently weak
        if (rating === 0 || rating === 1 || prevConf === 0 || prevConf === undefined) {
          var mk2 = wordKey(r);
          var seen = matchBuffer.some(function(x) {
            return wordKey(x) === mk2;
          });
          if (!seen && (r.khmer || '') && (r.english || '')) matchBuffer.push(r);
        }
      }
      nextCard();
    }

    function prevCard() {
      if (studyIdx > 0) {
        studyIdx--;
        showCard();
      }
    }

    function nextCard() {
      if (pendingMcRating !== null) {
        var _r = pendingMcRating;
        pendingMcRating = null;
        rateCard(_r);
        return;
      }
      if (S.match5 && !matchActive && matchBuffer.length >= 5) {
        if (showMatchPanel()) return;
      }
      if (studyIdx < studyDeck.length - 1) {
        studyIdx++;
        showCard();
      } else showSessionSummary();
    }

    function studyWeak() {
      var rb = (parseInt(ls('kv_reset_btn') || '0')) + 1;
      lsSet('kv_reset_btn', String(rb));
      checkAndUnlock('reset_button');
      setStudyFilterValues(['All']);
      if (el('study-preset-filter')) el('study-preset-filter').value = '__weak__';
      initStudy();
    }

    function showSessionSummary() {
      var fc = el('flashcard'),
        sn = el('study-nav'),
        cb = el('conf-btns'),
        ss = el('session-summary'),
        fsb = el('fc-speak-btn'),
        st = el('fc-stage');
      var isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (fc) fc.style.display = 'none';
      if (sn) sn.style.display = 'none';
      if (cb) cb.style.display = 'none';
      if (ss) ss.style.display = 'block';
      if (fsb) fsb.style.display = 'none';
      if (isFs && st && ss && ss.parentElement !== st) {
        st.appendChild(ss);
      }
      hideMatchPanel();
      _studySyncDirty = true;
      flushStudySync();
      var sxf = el('ss-exit-fs');
      if (sxf) sxf.style.display = isFs ? 'flex' : 'none';
      var ssk = el('ss-k'),
        ssm = el('ss-m'),
        ssu = el('ss-u');
      if (ssk) ssk.textContent = sessionK;
      if (ssm) ssm.textContent = sessionM;
      if (ssu) ssu.textContent = sessionU;
      var swb = el('ss-weak-btn');
      if (swb) swb.style.display = sessionU > 0 ? 'flex' : 'none';
      if (readOnlyMode && (sessionK + sessionM + sessionU) >= 20) {
        var ec = (parseInt(ls(EXPLORER_KEY) || '0')) + 1;
        lsSet(EXPLORER_KEY, String(ec));
        checkAndUnlock('explorer');
      }
    }

        function trackConfidenceMovement(fromConf, toConf) {
      try {
        var today = todayKH();
        var stored = ls('kv_daily_moves') ? JSON.parse(ls('kv_daily_moves')) : {};
        if (stored.date !== today) {
          stored = { date: today, moves: { u2k: 0, u2g: 0, k2g: 0, g2u: 0, totalReviewed: 0 } };
        }
        stored.moves.totalReviewed++;
        if ((fromConf === 0 || fromConf === undefined) && toConf === 1) stored.moves.u2k++;
        else if ((fromConf === 0 || fromConf === undefined) && toConf === 2) stored.moves.u2g++;
        else if (fromConf === 1 && toConf === 2) stored.moves.k2g++;
        else if (fromConf === 2 && toConf === 0) stored.moves.g2u++;
        lsSet('kv_daily_moves', JSON.stringify(stored));
      } catch (e) {}
      var inc = { reviewed: 1 };
      if ((fromConf === 0 || fromConf === undefined) && toConf === 1) inc.u2k = 1;
      else if ((fromConf === 0 || fromConf === undefined) && toConf === 2) inc.u2g = 1;
      else if (fromConf === 1 && toConf === 2) inc.k2g = 1;
      else if (fromConf === 2 && toConf === 0) inc.g2u = 1;
      if (toConf === 2) inc.got = 1; else if (toConf === 1) inc.kinda = 1; else inc.unknown = 1;
      recordReport(inc);
    }

    // ---------- Daily / weekly reports (rolling 2 weeks, week starts Monday 17:30 KH) ----------
    var REPORT_FIELDS = ['reviewed', 'got', 'kinda', 'unknown', 'u2k', 'u2g', 'k2g', 'g2u', 'added'];
    function _khDateStr(ms) {
      var d = new Date(ms + 7 * 3600000), p = function(x) { return x < 10 ? '0' + x : String(x); };
      return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
    }
    // UTC ms of the Monday 17:30 KH week start containing ms.
    function reportWeekStartMs(ms) {
      var KH = 7 * 3600000, kh = new Date(ms + KH);
      var diff = (kh.getUTCDay() + 6) % 7;
      var start = Date.UTC(kh.getUTCFullYear(), kh.getUTCMonth(), kh.getUTCDate() - diff, 17, 30) - KH;
      if (ms < start) start -= 7 * 86400000;
      return start;
    }
    function reportWeekKey(ms) { return _khDateStr(reportWeekStartMs(ms)); }
    function loadReports() {
      var r = safeJsonParse(ls(REPORTS_KEY), null);
      if (!r || typeof r !== 'object') r = {};
      r.days = r.days || {}; r.weeks = r.weeks || {};
      return r;
    }
    function _blankCounts() { var o = {}; REPORT_FIELDS.forEach(function(k) { o[k] = 0; }); return o; }
    // Roll completed weeks into summaries and prune anything older than the previous week.
    function rollupReports(r, now) {
      now = now || Date.now();
      var curWk = reportWeekKey(now);
      var prevWk = reportWeekKey(reportWeekStartMs(now) - 1);
      var weeks = {};
      Object.keys(r.days).forEach(function(d) {
        var w = r.days[d].w || {};
        Object.keys(w).forEach(function(wk) {
          if (!weeks[wk]) weeks[wk] = _blankCounts();
          REPORT_FIELDS.forEach(function(k) { weeks[wk][k] += (w[wk][k] || 0); });
          weeks[wk].days = (weeks[wk].days || 0) + 1;
        });
      });
      Object.keys(weeks).forEach(function(wk) {
        var prior = r.weeks[wk] || {};
        weeks[wk].start = wk;
        weeks[wk].complete = wk < curWk;
        if (weeks[wk].complete && !prior.rolledAt) weeks[wk].rolledAt = nowKH();
        else if (prior.rolledAt) weeks[wk].rolledAt = prior.rolledAt;
        r.weeks[wk] = weeks[wk];
      });
      // keep 2 weeks of daily data; keep 8 weekly summaries
      Object.keys(r.days).forEach(function(d) {
        var w = r.days[d].w || {};
        var keep = Object.keys(w).some(function(wk) { return wk >= prevWk; });
        if (!keep) delete r.days[d];
      });
      Object.keys(r.weeks).sort().slice(0, -8).forEach(function(wk) { delete r.weeks[wk]; });
      return r;
    }
    function recordReport(inc, ms) {
      if (S.dailyWords === false) return;
      try {
        ms = ms || Date.now();
        var r = loadReports();
        var day = _khDateStr(ms), wk = reportWeekKey(ms);
        var d = r.days[day] || (r.days[day] = { date: day, w: {} });
        var c = d.w[wk] || (d.w[wk] = _blankCounts());
        Object.keys(inc).forEach(function(k) { c[k] = (c[k] || 0) + inc[k]; });
        lsSet(REPORTS_KEY, JSON.stringify(rollupReports(r, ms)));
      } catch (e) {}
    }
    function dayTotals(d) {
      var t = _blankCounts();
      Object.keys((d && d.w) || {}).forEach(function(wk) { REPORT_FIELDS.forEach(function(k) { t[k] += d.w[wk][k] || 0; }); });
      return t;
    }

    async function openDailyReportModal() {
      if (typeof saveUserStatsToSheet === 'function' && SCRIPT_URL) {
        try { await saveUserStatsToSheet(); } catch (e) {}
      }
      var old = document.querySelector('.daily-report-modal');
      if (old) old.remove();
      var r = rollupReports(loadReports());
      lsSet(REPORTS_KEY, JSON.stringify(r));
      var today = todayKH();
      var t = dayTotals(r.days[today]);
      var curWk = reportWeekKey(Date.now());
      var prevWk = reportWeekKey(reportWeekStartMs(Date.now()) - 1);
      var cw = r.weeks[curWk] || _blankCounts(), pw = r.weeks[prevWk];
      var tile = function(v, l, col) { return '<div class="daily-stat-tile"><div class="daily-stat-val"' + (col ? ' style="color:' + col + '"' : '') + '>' + v + '</div><div class="daily-stat-lbl">' + l + '</div></div>'; };
      var days = Object.keys(r.days).sort().reverse();
      var dayRows = days.map(function(d) {
        var x = dayTotals(r.days[d]);
        return '<tr><td>' + fmtRepDate(d) + '</td><td>' + x.reviewed + '</td><td>+' + (x.u2g + x.k2g) + '</td><td>' + x.added + '</td></tr>';
      }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--dim)">No activity yet</td></tr>';
      var modal = document.createElement('div');
      modal.className = 'daily-report-modal';
      modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
      modal.innerHTML = '<div class="daily-report-card">' +
        '<div class="daily-report-head">' +
          '<div class="daily-report-title">📊 Learning Reports</div>' +
          '<button class="srch-clear" onclick="this.closest(\'.daily-report-modal\').remove()">×</button>' +
        '</div>' +
        '<div class="rep-sec-title">Today · ' + fmtRepDate(today) + '</div>' +
        '<div class="daily-report-grid">' +
          tile(t.reviewed, 'Cards Reviewed') + tile('+' + (t.k2g + t.u2g), 'Moved to "Got It"', 'var(--ok)') +
          tile('+' + t.u2k, 'Promoted to "Kind Of"', 'var(--warn)') + tile(t.g2u, 'Reset to Unknown', 'var(--bad)') +
        '</div>' +
        '<div class="rep-sec-title">This week · from Mon ' + fmtRepDate(curWk) + ' 5:30 PM</div>' +
        '<div class="daily-report-grid">' + tile(cw.reviewed, 'Reviewed') + tile(cw.added, 'Words added') +
          tile(cw.got, 'Got It ratings', 'var(--ok)') + tile(cw.unknown, "Didn't know", 'var(--bad)') + '</div>' +
        (pw ? '<div class="rep-sec-title">Last week · ' + fmtRepDate(prevWk) + (pw.complete ? ' (final)' : '') + '</div>' +
          '<div class="daily-report-grid">' + tile(pw.reviewed, 'Reviewed') + tile(pw.added, 'Words added') +
          tile(pw.got, 'Got It ratings', 'var(--ok)') + tile(pw.days || 0, 'Active days') + '</div>' : '') +
        '<div class="rep-sec-title">Daily history (2 weeks)</div>' +
        '<div class="rep-table-wrap"><table class="rep-table"><thead><tr><th>Day</th><th>Reviewed</th><th>Got It</th><th>Added</th></tr></thead><tbody>' + dayRows + '</tbody></table></div>' +
        '<div class="rep-actions">' +
          '<button class="bbtn rep-png-btn" onclick="exportReportPng()">🖼 Save as PNG</button>' +
          '<button class="bbtn rep-close-btn" onclick="this.closest(\'.daily-report-modal\').remove()">Close</button>' +
        '</div>' +
      '</div>';
      document.body.appendChild(modal);
    }

    // Renders the current daily + weekly report to a PNG image and downloads it.
    function exportReportPng() {
      var r = rollupReports(loadReports());
      var cs = getComputedStyle(document.documentElement);
      var cv = function(n, d) { return (cs.getPropertyValue(n) || '').trim() || d; };
      var C = { bg: cv('--bg', '#0f0f1a'), surf: cv('--surf', '#1a1a2e'), bdr: cv('--bdr', '#2d2d4e'), text: cv('--text', '#e2e8f0'),
        dim: cv('--dim', '#94a3b8'), acc: cv('--acc3', '#c084fc'), ok: cv('--ok', '#22c55e'), warn: cv('--warn', '#f59e0b'), bad: cv('--bad', '#c1362f') };
      var now = Date.now(), curWk = reportWeekKey(now), prevWk = reportWeekKey(reportWeekStartMs(now) - 1);
      var days = Object.keys(r.days).sort().reverse();
      var W = 900, rowH = 38, H = 520 + Math.max(1, days.length) * rowH + 60;
      var cvs = document.createElement('canvas'), dpr = 2;
      cvs.width = W * dpr; cvs.height = H * dpr;
      var g = cvs.getContext('2d');
      g.scale(dpr, dpr);
      var font = function(sz, w) { g.font = (w || 400) + ' ' + sz + 'px system-ui, -apple-system, Segoe UI, sans-serif'; };
      var rr = function(x, y, w, h, rad, fill, stroke) {
        g.beginPath(); g.moveTo(x + rad, y); g.arcTo(x + w, y, x + w, y + h, rad); g.arcTo(x + w, y + h, x, y + h, rad);
        g.arcTo(x, y + h, x, y, rad); g.arcTo(x, y, x + w, y, rad); g.closePath();
        if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.stroke(); }
      };
      g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
      font(30, 700); g.fillStyle = C.acc; g.fillText('📊 Khmer Vocab — Learning Report', 40, 60);
      font(15); g.fillStyle = C.dim; g.fillText((MAIN_USER || '') + ' · generated ' + nowKH() + ' (Cambodia time)', 40, 88);
      var block = function(y, title, wk) {
        var s = r.weeks[wk] || _blankCounts();
        font(16, 700); g.fillStyle = C.text; g.fillText(title, 40, y);
        var tiles = [[s.reviewed, 'Reviewed', C.text], [s.added, 'Words added', C.acc], [s.got, 'Got It', C.ok], [s.kinda, 'Kind Of', C.warn], [s.unknown, "Didn't know", C.bad]];
        var tw = (W - 80 - 4 * 12) / 5;
        tiles.forEach(function(t, i) {
          var x = 40 + i * (tw + 12);
          rr(x, y + 14, tw, 86, 12, C.surf, C.bdr);
          font(28, 700); g.fillStyle = t[2]; g.fillText(String(t[0] || 0), x + 16, y + 58);
          font(13); g.fillStyle = C.dim; g.fillText(t[1], x + 16, y + 84);
        });
      };
      block(140, 'This week (from Mon ' + fmtRepDate(curWk) + ' 5:30 PM)', curWk);
      block(280, 'Last week (' + fmtRepDate(prevWk) + ')' + ((r.weeks[prevWk] || {}).complete ? ' — final' : ''), prevWk);
      var y = 430;
      font(16, 700); g.fillStyle = C.text; g.fillText('Daily history', 40, y);
      y += 16;
      rr(40, y, W - 80, (Math.max(1, days.length) + 1) * rowH + 8, 12, C.surf, C.bdr);
      var cols = [60, 330, 520, 710];
      font(13, 700); g.fillStyle = C.dim;
      ['Day', 'Reviewed', 'Moved to Got It', 'Added'].forEach(function(h, i) { g.fillText(h, cols[i], y + 26); });
      font(15);
      if (!days.length) { g.fillStyle = C.dim; g.fillText('No activity yet', cols[0], y + 26 + rowH); }
      days.forEach(function(d, i) {
        var x = dayTotals(r.days[d]), yy = y + 26 + (i + 1) * rowH;
        g.strokeStyle = C.bdr; g.beginPath(); g.moveTo(56, yy - 25); g.lineTo(W - 56, yy - 25); g.stroke();
        g.fillStyle = C.text; g.fillText(fmtRepDate(d), cols[0], yy);
        g.fillText(String(x.reviewed), cols[1], yy);
        g.fillStyle = C.ok; g.fillText('+' + (x.u2g + x.k2g), cols[2], yy);
        g.fillStyle = C.acc; g.fillText(String(x.added), cols[3], yy);
      });
      cvs.toBlob(async function(blob) {
        if (!blob) { toast('Could not create image.', 'err'); return; }
        var res = await saveFileWithPicker(blob, 'khmer-vocab-report-' + todayKH() + '.png', 'image/png', 'PNG Image');
        if (res !== 'cancelled') toast('Report image saved ✓', 'ok');
      }, 'image/png');
    }

    function updateStudyStreak() {
      function khDate(offsetDays) {
        var d = new Date(Date.now() + 7 * 3600000 + (offsetDays || 0) * 86400000);
        var p = function(x) {
          return x < 10 ? '0' + x : String(x);
        };
        return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
      }
      var today = khDate(0);
      var sd = safeJsonParse(ls(STREAK_KEY), {
        count: 0,
        lastDate: ''
      });
      if (sd.lastDate === today) return;
      var yesterday = khDate(-1);
      sd.count = (sd.lastDate === yesterday) ? (sd.count || 0) + 1 : 1;
      sd.lastDate = today;
      lsSet(STREAK_KEY, JSON.stringify(sd));
      var curBest = parseInt(ls(BEST_STREAK_KEY) || '0', 10);
      if (sd.count > curBest) lsSet(BEST_STREAK_KEY, String(sd.count));
      checkAndUnlock('daily_habit');
      checkAndUnlock('marathon');
    }

    var STATS_SAVED_DATE_KEY = 'kv_stats_saved_date';

    function renderProgress() {
      var pgNote = el('pg-stats-note');
      if (pgNote) {
        if (readOnlyMode) {
          pgNote.textContent = 'Viewing ' + CURRENT_USER + '\'s stats — last saved to sheet';
          pgNote.style.display = 'block';
          loadUserStatsFromSheet(CURRENT_USER);
        } else {
          pgNote.style.display = 'none';
        }
      }
      var total = allRows.length,
        favCount = 0,
        mastered = 0,
        studiedCount = 0;
      allRows.forEach(function(r) {
        if (isFav(r)) favCount++;
        if (confidence[wordKey(r)] === 2) mastered++;
        if (confidence[wordKey(r)] !== undefined) studiedCount++;
      });

      function sv(id, v) {
        var e = el(id);
        if (e) e.textContent = v;
      }
      sv('pg-total', total);
      sv('pg-fav', readOnlyMode ? '——' : favCount);
      sv('pg-mastered', readOnlyMode ? '——' : mastered);
      sv('pg-due', readOnlyMode ? '——' : countDue());
      sv('pg-studied', readOnlyMode ? '——' : studiedCount);
      var streakData = safeJsonParse(ls(STREAK_KEY), {
        count: 0,
        lastDate: ''
      });
      sv('pg-streak', readOnlyMode ? '——' : (streakData.count || 0));
      var _storedBest = parseInt(ls(BEST_STREAK_KEY) || '0', 10);
      var _currentStreak = readOnlyMode ? 0 : (streakData.count || 0);
      if (!readOnlyMode && _currentStreak > _storedBest) {
        _storedBest = _currentStreak;
        lsSet(BEST_STREAK_KEY, String(_storedBest));
      }
      sv('pg-best-streak', readOnlyMode ? '——' : _storedBest);
      var knew = 0,
        kinda = 0,
        unkn = 0,
        unstudied = 0;
      allRows.forEach(function(r) {
        var v = confidence[wordKey(r)];
        if (v === 2) knew++;
        else if (v === 1) kinda++;
        else if (v === 0) unkn++;
        else unstudied++;
      });
      sv('pg-knew', readOnlyMode ? '——' : knew);
      sv('pg-kinda', readOnlyMode ? '——' : kinda);
      sv('pg-unkn', readOnlyMode ? '——' : unkn);
      sv('pg-unstudied', readOnlyMode ? '——' : unstudied);

      function buildShelf(sid, count, milestones) {
        var shelf = el(sid);
        if (!shelf) return;
        shelf.innerHTML = '';
        var firstLocked = null;
        milestones.forEach(function(m) {
          var card = document.createElement('div');
          var unlocked = count >= m.n;
          card.className = 'ms-card' + (unlocked ? ' unlocked' : '');
          card.innerHTML = '<div class="ms-icon">' + m.icon + '</div><div class="ms-name">' + m.name + '</div><div class="ms-req">' + (unlocked ? '✓' : m.n + ' words') + '</div>';
          shelf.appendChild(card);
          if (!unlocked && !firstLocked) firstLocked = card;
        });
        if (firstLocked) {
          setTimeout(function() {
            var cardWidth = firstLocked.offsetWidth || 64;
            var gap = 6;
            var shelfWidth = shelf.clientWidth;
            var cardLeft = firstLocked.offsetLeft;
            shelf.scrollLeft = Math.max(0, cardLeft + cardWidth - shelfWidth + gap);
          }, 50);
        }
      }
      renderAchvShelf();
      buildShelf('milestone-shelf-add', total, MILESTONES_ADD);
      buildShelf('milestone-shelf-study', studiedCount, MILESTONES_STUDY);
      buildShelf('milestone-shelf-master', mastered, MILESTONES_MASTER);
      var streakSnap = safeJsonParse(ls(STREAK_KEY), {
        count: 0
      });
      buildShelf('milestone-shelf-streak', streakSnap.count || 0, MILESTONES_STREAK);
      var bars = el('pg-cat-bars');
      if (bars) {
        bars.innerHTML = '';
        var cats = {};
        allRows.forEach(function(r) {
          getWordCategories(r).forEach(function(c) { cats[c] = (cats[c] || 0) + 1; });
        });
        var sorted = Object.keys(cats).sort(function(a, b) {
          return cats[b] - cats[a];
        });
        var t2 = total || 1;
        if (!sorted.length) {
          bars.innerHTML = '<div style="font-size:.78rem;color:var(--dim)">No data yet.</div>';
        }
        sorted.forEach(function(cat) {
          var pct = Math.round(cats[cat] / t2 * 100),
            row = document.createElement('div');
          row.className = 'cat-row';
          row.innerHTML = '<div class="cat-row-top"><span>' + esc(cat) + '</span><span>' + cats[cat] + ' (' + pct + '%)</span></div><div class="cat-bar-bg"><div class="cat-bar-fill" style="width:' + pct + '%"></div></div>';
          bars.appendChild(row);
        });
      }
      var ssets = el('pg-study-sets');
      if (ssets) {
        ssets.innerHTML = '';
        if (!studySets.length) ssets.innerHTML = '<div style="font-size:.78rem;color:var(--dim)">No study sets yet.</div>';
        else studySets.forEach(function(s) {
          var row = document.createElement('div');
          row.className = 'cat-row';
          row.innerHTML = '<div class="cat-row-top"><span>📚 ' + esc(s.name) + '</span><span>' + s.keys.length + ' words</span></div>';
          ssets.appendChild(row);
        });
      }
      var hm = el('heatmap');
      if (hm) {
        hm.innerHTML = '';

        var _hmOff = 7 * 3600000;
        var today = new Date(Date.now() + _hmOff),
          dc = {};
        allRows.forEach(function(r) {
          if (r.dateAdded) {
            var d = String(r.dateAdded).slice(0, 10);
            dc[d] = (dc[d] || 0) + 1;
          }
        });
        for (var i = 27; i >= 0; i--) {
          var d2 = new Date(Date.now() + _hmOff);
          d2.setUTCDate(d2.getUTCDate() - i);
          var key = (function(dt) {
              var p = function(x) {
                return x < 10 ? '0' + x : String(x);
              };
              return dt.getUTCFullYear() + '-' + p(dt.getUTCMonth() + 1) + '-' + p(dt.getUTCDate());
            })(d2),
            cnt = dc[key] || 0,
            cell = document.createElement('div');
          cell.className = 'hm-cell' + (cnt === 0 ? '' : cnt < 3 ? ' hm1' : cnt < 7 ? ' hm2' : ' hm3');
          cell.title = key + ': ' + cnt + ' words';
          hm.appendChild(cell);
        }
      }
      if (!readOnlyMode) saveUserStatsToSheet();
    }

    var _lastStatsSyncTime = 0;
    var _studySessionActive = false, _studySyncDirty = false;
    function flushStudySync() {
      var wasActive = _studySessionActive;
      _studySessionActive = false;
      if (!_studySyncDirty && !wasActive) return;
      _studySyncDirty = false;
      if (!readOnlyMode && SCRIPT_URL && MAIN_USER) {
        saveUserStatsToSheet(true);
        saveUserDataToSheet(true);
      }
    }
    document.addEventListener('visibilitychange', function() { if (document.visibilityState === 'hidden') flushStudySync(); });
    window.addEventListener('pagehide', flushStudySync);
    function saveUserStatsToSheet(force) {
      if (!SCRIPT_URL || !MAIN_USER) return;
      if (readOnlyMode) return; // allRows holds someone else's words while viewing — never save them as your stats
      var now = Date.now();
      // During a flashcard session progress stays local; flushStudySync() sends it once at the end
      if (!force && _studySessionActive) { _studySyncDirty = true; return; }
      if (!force && (now - _lastStatsSyncTime < 25000)) { _studySyncDirty = true; return; } // debounce 25s
      _lastStatsSyncTime = now;
      var _p = function(x) {
        return x < 10 ? '0' + x : String(x);
      };
      var _dn = new Date(Date.now() + 7 * 3600000);
      var _today = _dn.getUTCFullYear() + '-' + _p(_dn.getUTCMonth() + 1) + '-' + _p(_dn.getUTCDate());
      lsSet(STATS_SAVED_DATE_KEY, _today);
      var total = allRows.length;
      var mastered = 0,
        studied = 0,
        knew = 0,
        kinda = 0,
        unkn = 0;
      allRows.forEach(function(r) {
        var c = confidence[wordKey(r)];
        if (c === 2) {
          mastered++;
          knew++;
          studied++;
        } else if (c === 1) {
          kinda++;
          studied++;
        } else if (c === 0) {
          unkn++;
          studied++;
        }
      });
      var streakSnap = safeJsonParse(ls(STREAK_KEY), {
        count: 0
      });
      var unlockedIds = ACHIEVEMENTS.filter(function(a) {
        return achievements[a.id] && achievements[a.id].unlocked;
      }).map(function(a) {
        return a.id;
      });
      var achievementsDetail = {};
      unlockedIds.forEach(function(aid) {
        var aObj = ACHIEVEMENTS.find(function(x) { return x.id === aid; });
        achievementsDetail[aid] = {
          unlockedAt: achievements[aid]?.unlockedAt || _today,
          title: aObj ? aObj.title : aid,
          desc: aObj ? aObj.desc : ''
        };
      });
      var stats = {
        streak: streakSnap.count || 0,
        bestStreak: Math.max(parseInt(ls(BEST_STREAK_KEY) || '0', 10), streakSnap.count || 0),
        totalWords: total,
        mastered: mastered,
        studied: studied,
        knew: knew,
        kinda: kinda,
        unkn: unkn,
        favCount: favorites.size,
        achievementCount: unlockedIds.length,
        lastActive: _today,
        timestamp: new Date().toISOString(),
        appVersion: APP_VERSION
      };
      postToSheet({ action: 'saveUserStats', user: MAIN_USER, stats: JSON.stringify(stats) });
      var achvPayload = JSON.stringify({ unlocked: unlockedIds, detail: achievementsDetail });
      if (achvPayload !== _lastAchvPayload) {
        _lastAchvPayload = achvPayload;
        postToSheet({ action: 'saveUserAchievements', user: MAIN_USER, achievements: achvPayload });
      }
      saveUserDataToSheet();
    }
    var _lastAchvPayload = '';

    // POST (form-encoded = no CORS preflight) so large payloads are not cut off by URL length limits
    function postToSheet(params) {
      if (!SCRIPT_URL) return Promise.resolve(null);
      var body = new URLSearchParams();
      Object.keys(params).forEach(function(k) { body.set(k, params[k] == null ? '' : String(params[k])); });
      return fetch(SCRIPT_URL, { method: 'POST', body: body }).then(function(r) { return r.json(); }).catch(function() { return null; });
    }

    // Device data that is backed up to the sheet (restored on a new device / after clearing the browser)
    var USERDATA_KEYS = [FAV_KEY, CONF_KEY, SRS_KEY, SETS_KEY, CATS_KEY, CAT_ORDER_KEY, DELETED_CATS_KEY, SKEY, THEME_KEY,
      STREAK_KEY, BEST_STREAK_KEY, ACHV_KEY, WEEKLY_ADD_KEY, COMEBACK_KEY, BURGLAR_KEY, EXPLORER_KEY, EARLY_BIRD_KEY,
      NIGHT_OWL_KEY, COMPETITIVE_KEY, COL_WIDTHS_KEY, TAB_ORDER_KEY, HIDDEN_TABS_KEY, REPORTS_KEY];
    var _lastUserDataSave = 0;

    function collectUserData() {
      var out = {};
      USERDATA_KEYS.forEach(function(k) { var v = ls(k); if (v !== null && v !== '') out[k] = v; });
      // Compact the SM-2 map (~70% smaller; unstudied cards dropped)
      if (out[SRS_KEY]) out[SRS_KEY] = srsToCompact(srsData);
      // Confidence: drop null/invalid entries so only real ratings travel
      if (out[CONF_KEY]) {
        var c = {};
        Object.keys(confidence || {}).forEach(function(k) { var v = confidence[k]; if (v === 0 || v === 1 || v === 2) c[k] = v; });
        out[CONF_KEY] = JSON.stringify(c);
      }
      return out;
    }

    function saveUserDataToSheet(force) {
      if (!SCRIPT_URL || !MAIN_USER || readOnlyMode) return;
      if (!force && Date.now() - _lastUserDataSave < 120000) return; // at most every 2 min
      var json = JSON.stringify(collectUserData());
      var h = MAIN_USER + ':' + json.length + ':' + simpleHash(json);
      if (!force && ls(USERDATA_SYNC_KEY) === h) return; // unchanged
      _lastUserDataSave = Date.now();
      // clientTimestamp enables the server's multi-device merge: if another
      // device saved after this timestamp, the server merges SM-2 card states
      // (higher repetitions / later dueDate wins) instead of overwriting.
      postToSheet({ action: 'saveUserData', user: MAIN_USER, data: json, clientTimestamp: String(_lastUserDataSave) }).then(function(j) {
        if (j && j.success) {
          lsSet(USERDATA_SYNC_KEY, h);
          // Server merged with a newer device's data — adopt the merged SM-2 map locally
          if (j.merged && j.data && j.data[SRS_KEY]) {
            try {
              var serverSrs = srsFromAny(j.data[SRS_KEY]);
              var localSrs = srsData;
              var changed = false;
              Object.keys(serverSrs).forEach(function(k) {
                var s = serverSrs[k], l = localSrs[k];
                var sReps = s ? (s.repetitions != null ? s.repetitions : s.reps || 0) : -1;
                var lReps = l ? (l.repetitions != null ? l.repetitions : l.reps || 0) : -1;
                if (!l || sReps > lReps || (sReps === lReps && (Number(s.dueDate) || 0) > (Number(l.dueDate) || 0))) { localSrs[k] = s; changed = true; }
              });
              if (changed) { srsData = localSrs; lsSet(SRS_KEY, JSON.stringify(srsData)); }
            } catch (e) {}
          }
        }
      });
    }

    function simpleHash(str) {
      var h = 0;
      for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
      return String(h);
    }

    // Restores only keys that are missing on this device — never overwrites local data.
    function restoreUserDataFromSheet() {
      if (!SCRIPT_URL || !MAIN_USER) return;
      fetch(SCRIPT_URL + '?action=getUserData&user=' + encodeURIComponent(MAIN_USER)).then(function(r) { return r.json(); }).then(function(j) {
        if (!j || !j.success || !j.data) return;
        var restored = 0;
        Object.keys(j.data).forEach(function(k) {
          if (USERDATA_KEYS.indexOf(k) === -1) return;
          var cur = ls(k);
          if (cur === null || cur === '' || cur === '{}' || cur === '[]') {
            var v = j.data[k];
            if (k === SRS_KEY && v) v = JSON.stringify(srsFromAny(v)); // compact → verbose for local use
            if (v && v !== cur && v !== '{}') { lsSet(k, v); restored++; }
          }
        });
        if (!restored) return;
        favorites = new Set(safeJsonParse(ls(FAV_KEY), []));
        confidence = safeJsonParse(ls(CONF_KEY), {});
        srsData = srsFromAny(ls(SRS_KEY));
        customCats = safeJsonParse(ls(CATS_KEY), []);
        deletedCats = safeJsonParse(ls(DELETED_CATS_KEY), []);
        catOrder = safeJsonParse(ls(CAT_ORDER_KEY), []);
        colWidths = safeJsonParse(ls(COL_WIDTHS_KEY), {});
        studySets = safeJsonParse(ls(SETS_KEY), []);
        achievements = safeJsonParse(ls(ACHV_KEY), {});
        setTimeout(auditAchievements, 500);
        try { refreshAllCatDropdowns(); render(); renderFav(); renderProgress(); } catch (e) {}
        toast('✓ Restored ' + restored + ' saved setting' + (restored !== 1 ? 's' : '') + ' from your sheet', 'ok');
      }).catch(function() {});
    }

    function loadUserStatsFromSheet(userName) {
      if (!SCRIPT_URL || !userName) return;
      fetch(SCRIPT_URL + '?action=getUserAchievements&user=' + encodeURIComponent(userName))
        .then(function(r) { return r.json(); })
        .then(function(j) {
          if (j && j.success && j.achievements && Array.isArray(j.achievements.unlocked) && readOnlyMode && CURRENT_USER === userName)
            renderAchvShelfForUser(j.achievements.unlocked);
        }).catch(function() {});
      fetch(SCRIPT_URL + '?action=getUserStats&user=' + encodeURIComponent(userName))
        .then(function(r) {
          return r.json();
        })
        .then(function(j) {
          if (!j.success || !j.stats) return;
          var s = j.stats;

          function sv2(id, v) {
            var e = el(id);
            if (e && v !== undefined && v !== null) e.textContent = v;
          }
          if (s.favCount !== undefined) sv2('pg-fav', s.favCount);
          if (s.mastered !== undefined) sv2('pg-mastered', s.mastered);
          if (s.studied !== undefined) sv2('pg-studied', s.studied);
          if (s.streak !== undefined) sv2('pg-streak', s.streak);
          if (s.bestStreak !== undefined) sv2('pg-best-streak', s.bestStreak);
          if (s.knew !== undefined) sv2('pg-knew', s.knew);
          if (s.kinda !== undefined) sv2('pg-kinda', s.kinda);
          if (s.unkn !== undefined) sv2('pg-unkn', s.unkn);
          if (Array.isArray(s.achievements)) renderAchvShelfForUser(s.achievements); // legacy (old saves)
          if (s.savedAt) {
            var note = el('pg-stats-note');
            if (note) note.textContent = 'Viewing ' + userName + '\'s stats — last saved ' + s.savedAt + ' (Cambodia time)';
          }
        }).catch(function() {});
    }


    function loadTopCurrentStreak(users) {
      if (!SCRIPT_URL || !users || !users.length) return Promise.resolve({
        user: '',
        count: 0
      });
      var STALE_MS = 2 * 86400000;
      var nowMs = Date.now();
      return Promise.all(users.map(function(u) {
        return fetch(SCRIPT_URL + '?action=getUserStats&user=' + encodeURIComponent(u.name))
          .then(function(r) {
            return r.json();
          }).then(function(j) {
            if (!j.success || !j.stats) return null;
            var s = j.stats;
            var savedMs = parseKhDateMs(s.savedAt);
            if (isNaN(savedMs) || (nowMs - savedMs) > STALE_MS) return null;
            return {
              user: u.name,
              count: s.streak || 0
            };
          }).catch(function() {
            return null;
          });
      })).then(function(results) {
        var best = null;
        results.forEach(function(r) {
          if (r && r.count > 0 && (!best || r.count > best.count)) best = r;
        });
        return best || {
          user: '',
          count: 0
        };
      });
    }

    function renderAchvShelfForUser(unlockedIds) {
      var shelf = el('achv-shelf');
      if (!shelf) return;
      shelf.innerHTML = '';
      ACHIEVEMENTS.forEach(function(a) {
        var unlocked = unlockedIds.indexOf(a.id) !== -1;
        var card = document.createElement('div');
        card.className = 'ms-card achv-card' + (unlocked ? ' unlocked' : '');
        card.innerHTML = '<div class="ms-icon">' + a.icon + '</div>' +
          '<div class="ms-name">' + (a.secret && !unlocked ? '???' : esc(a.name)) + '</div>' +
          '<div class="ms-req">' + (unlocked ? '✓' : '🔒') + '</div>';
        shelf.appendChild(card);
      });
    }

    var _dashLoadInFlight = false, _dashQueuedForce = false;
    var _dashRenderedTs = 0; // cache timestamp of what is currently on screen

    // Most recent 6:00 AM Cambodia time (UTC+7) at or before now, as UTC ms.
    function lastDashBoundaryMs(now) {
      now = now || Date.now();
      var KH = 7 * 3600000;
      var kh = new Date(now + KH);
      var b = Date.UTC(kh.getUTCFullYear(), kh.getUTCMonth(), kh.getUTCDate(), 6, 0, 0, 0) - KH;
      if (now < b) b -= 86400000;
      return b;
    }

    function readDashCache() {
      var c = safeJsonParse(ls(DASH_STORE_KEY), null);
      return (c && c.stats && c.ts) ? c : null;
    }

    function writeDashCache(stats, rows) {
      var slim = function(r) {
        return { id: r.id, khmer: r.khmer, english: r.english, romanization: r.romanization, notes: r.notes,
          category: r.category, dateAdded: r.dateAdded, addedBy: r.addedBy };
      };
      var entry = { ts: Date.now(), stats: stats, rows: rows.map(slim) };
      try { lsSet(DASH_STORE_KEY, JSON.stringify(entry)); }
      catch (e) {
        try { entry.rows = entry.rows.slice(0, 400); lsSet(DASH_STORE_KEY, JSON.stringify(entry)); } catch (e2) {}
      }
      return entry;
    }

    // Newest first by dateAdded; undated rows fall back to sheet order
    // (rows appended to the bottom of the sheet are the newest).
    function sortRecentRows(rows) {
      return (rows || []).map(function(r, i) {
        var t = parseKhDateMs(r.dateAdded || r.created_at || r.added_at);
        return { r: r, t: isNaN(t) ? -Infinity : t, i: i };
      }).sort(function(a, b) {
        if (b.t !== a.t) return b.t - a.t;
        return b.i - a.i;
      }).map(function(x) { return x.r; });
    }

    function _dashShow(state) {
      el('dash-loading').style.display = state === 'loading' ? 'block' : 'none';
      el('dash-content').style.display = state === 'content' ? 'block' : 'none';
      el('dash-error').style.display = state === 'error' ? 'block' : 'none';
    }

    function renderDashFromCache(c) {
      if (!c) return false;
      if (_dashRenderedTs !== c.ts) {
        renderDashboard(c.stats, c.rows, c.ts);
        _dashRenderedTs = c.ts;
      }
      _dashShow('content');
      return true;
    }

    // force=true only from the manual refresh button; otherwise the cache is used until the next 6:00 AM (KH).
    // background=true: launch preload, never shows the skeleton.
    function loadDashboard(force, background) {
      if (!SCRIPT_URL) {
        _dashShow('error');
        el('dash-error-msg').textContent = 'Connect your sheet in ⚙️ first.';
        return;
      }
      var c = readDashCache();
      var fresh = c && c.ts >= lastDashBoundaryMs();
      if (!force) {
        if (c) renderDashFromCache(c);
        if (fresh) return;
      }
      if (_dashLoadInFlight) {
        if (force) _dashQueuedForce = true;
        return;
      }
      _dashLoadInFlight = true;
      var _drb = el('dash-refresh-btn');
      if (_drb) { _drb.disabled = true; _drb.classList.add('loading'); }
      if (!c && !background) _dashShow('loading');
      Promise.all([
        fetch(SCRIPT_URL + '?action=getStats').then(function(r) {
          return r.json();
        }),
        fetch(SCRIPT_URL + '?action=getData&user=' + encodeURIComponent('📋 All Words')).then(function(r) {
          return r.json();
        })
      ]).then(function(results) {
        if (!results[0].success) throw new Error(results[0].error || 'Failed');
        var rows = sortRecentRows((results[1] && results[1].data && results[1].data['📋 All Words']) || []);
        return loadTopCurrentStreak(results[0].users || []).then(function(top) {
          results[0]._clientTopStreak = top;
          var entry = writeDashCache(results[0], rows);
          entry.rows = rows; // full list on screen; only the stored copy is trimmed
          _dashRenderedTs = 0;
          renderDashFromCache(entry); // re-renders stats AND Recently Added Words
        });
      }).catch(function(err) {
        if (readDashCache()) {
          if (force) toast('Refresh failed: ' + err.message, 'err');
          return;
        }
        _dashShow('error');
        el('dash-error-msg').textContent = 'Error: ' + err.message + '. Check your sheet connection.';
      }).finally(function() {
        _dashLoadInFlight = false;
        var _drb2 = el('dash-refresh-btn');
        if (_drb2) { _drb2.disabled = false; _drb2.classList.remove('loading'); }
        if (_dashQueuedForce) { _dashQueuedForce = false; loadDashboard(true); }
      });
    }

    // Catch the 6:00 AM boundary while the app stays open.
    setInterval(function() {
      var c = readDashCache();
      if (SCRIPT_URL && MAIN_USER && c && c.ts < lastDashBoundaryMs()) loadDashboard(false, true);
    }, 10 * 60000);

    var _showInactiveUsers = false;
    function renderDashboard(stats, recentRows, fetchedTs) {
      recentRows = recentRows || [];
      var cards = el('dash-stat-cards');
      if (cards) {

        var _recentRows = recentRows;
        var _weekStart = currentWeekStartKH();
        var _wc = {};
        _recentRows.forEach(function(r) {
          if (!r.dateAdded || !r.addedBy) return;
          var _rd = parseKhDateMs(r.dateAdded);
          if (!isNaN(_rd) && _rd >= _weekStart) _wc[r.addedBy] = (_wc[r.addedBy] || 0) + 1;
        });
        var _topAdder = '',
          _topAdderCnt = 0;
        Object.keys(_wc).forEach(function(u) {
          if (_wc[u] > _topAdderCnt) {
            _topAdderCnt = _wc[u];
            _topAdder = u;
          }
        });

        function _mkCard(name, count, unit) {
          return '<span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.88em;max-width:100%">' + esc(name) + '</span>' +
            '<span style="display:block;font-size:.72em;opacity:.65">(' + count + ' ' + unit + ')</span>';
        }
        var _topAdderVal = _topAdder ? _mkCard(_topAdder, _topAdderCnt, 'words') : '0 words this week';


        if (_topAdder && _topAdderCnt > 0 && _topAdder === (CURRENT_USER || MAIN_USER)) {
          lsSet(COMPETITIVE_KEY, '1');
          checkAndUnlock('competitive');
        }

        var _cts = stats._clientTopStreak;
        var _streakVal = (_cts && _cts.user) ? _mkCard(_cts.user, _cts.count || 0, 'days') : '—';
        cards.innerHTML = [
          ['Total Words', stats.totalWords || 0],
          ['Unique Words', (stats.uniqueWords != null ? stats.uniqueWords : '—')],
          ['Total Users', stats.userCount || 0],
          ['Top Adder This Week 📅', _topAdderVal],
          ['Top current streak 🔥', _streakVal],
          ['Top Learner 🎓', stats.topLearner ? _mkCard(stats.topLearner, stats.topLearnerCount || 0, 'studied') : '—']
        ].map(function(d) {
          return '<div class="stat-card"><div class="sc-val">' + d[1] + '</div><div class="sc-lbl">' + d[0] + '</div></div>';
        }).join('');
      }
      var usersEl = el('dash-users');
      if (usersEl) {
        usersEl.innerHTML = '';

        var users = (stats.users || []).slice().sort(function(a, b) {
          if (a.name === ADMIN_USER && b.name !== ADMIN_USER) return -1;
          if (b.name === ADMIN_USER && a.name !== ADMIN_USER) return 1;
          if (a.name === MAIN_USER && b.name !== MAIN_USER) return -1;
          if (b.name === MAIN_USER && a.name !== MAIN_USER) return 1;
          return b.wordCount - a.wordCount;
        });
        // Your own count is live; others come from the nightly cache
        users = users.map(function(u) {
          return (u.name === MAIN_USER && !readOnlyMode) ? Object.assign({}, u, { wordCount: allRows.length }) : u;
        });
        var _inactive = users.filter(function(u) { return !u.wordCount && u.name !== MAIN_USER; });
        var _active = users.filter(function(u) { return u.wordCount || u.name === MAIN_USER; });
        users = _showInactiveUsers ? _active.concat(_inactive) : _active;
        if (!users.length) {
          usersEl.innerHTML = '<div style="font-size:.78rem;color:var(--dim)">No users yet.</div>';
        } else users.forEach(function(u) {
          var row = document.createElement('div');
          row.className = 'cat-row';
          var pct = stats.totalWords ? Math.round(u.wordCount / stats.totalWords * 100) : 0;
          var youTag = u.name === MAIN_USER ? ' <span style="color:var(--acc3);font-size:.65rem;font-weight:700">(you)</span>' : '';
          row.innerHTML = '<div class="cat-row-top"><span>' + esc(u.name) + youTag + '</span><span>' + u.wordCount + ' (' + pct + '%)</span></div><div class="cat-bar-bg"><div class="cat-bar-fill" style="width:' + pct + '%"></div></div>';
          if (u.name !== MAIN_USER) {
            row.style.cursor = 'pointer';
            row.title = 'View ' + u.name + '\u2019s sheet';
            row.onclick = function() {
              viewAsUser(u.name);
              goPage('progress', 'nav-progress');
              renderProgress();
            };
          }
          if (!u.wordCount && u.name !== MAIN_USER) row.classList.add('cat-row-inactive');
          usersEl.appendChild(row);
        });
        if (_inactive.length) {
          var tg = document.createElement('button');
          tg.className = 'dash-more-btn';
          tg.textContent = _showInactiveUsers ? '⬆ Hide ' + _inactive.length + ' inactive user' + (_inactive.length !== 1 ? 's' : '') + ' (0 words)'
            : '⬇ Show ' + _inactive.length + ' inactive user' + (_inactive.length !== 1 ? 's' : '') + ' (0 words)';
          tg.onclick = function() { _showInactiveUsers = !_showInactiveUsers; renderDashboard(stats, recentRows, fetchedTs); };
          usersEl.appendChild(tg);
        }
      }
      var recentEl = el('dash-recent');
      if (recentEl) {
        recentEl.innerHTML = '';
        _dashRecentRows = sortRecentRows(recentRows);
        _dashRecentShown = 0;
        if (!_dashRecentRows.length) {
          recentEl.innerHTML = '<div style="font-size:.78rem;color:var(--dim)">No recent activity.</div>';
        }
        showMoreRecent(true);
      }
      var updEl = el('dash-updated');
      if (updEl) updEl.textContent = 'Last refreshed: ' + new Date(fetchedTs || Date.now()).toLocaleString() + (stats.lastUpdated ? ' · Totals recounted: ' + stats.lastUpdated : '');
    }

    var _dashRecentRows = [], _dashRecentShown = 0, DASH_RECENT_FIRST = 20;
    function dashRecentPage() {
      var n = parseInt(S.recentPerPage, 10);
      return (n > 0 && n <= 500) ? n : 20;
    }

    // Collapse back to the first page of recent words (hides the ones loaded via "Show more").
    function collapseRecent() {
      var recentEl = el('dash-recent');
      if (!recentEl) return;
      recentEl.innerHTML = '';
      _dashRecentShown = 0;
      showMoreRecent(true);
      var card = el('dash-recent-card');
      if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    // Fast "is this word already mine?" check by Khmer text / Word ID (Set lookups).
    var _myKhSet = null, _myKhSetLen = -1;
    function isInMyWords(w) {
      var mine = readOnlyMode ? (_myRowsSnapshot || safeJsonParse(ls(CACHE_KEY), [])) : allRows;
      if (!_myKhSet || _myKhSetLen !== mine.length + pendingQueue.length) {
        _myKhSet = new Set();
        mine.concat(pendingQueue).forEach(function(r) {
          var k = (r.khmer || '').trim(); if (k) _myKhSet.add('k:' + k);
          if (r.id) _myKhSet.add('i:' + r.id);
          var e = (r.english || '').trim().toLowerCase(); if (!k && e) _myKhSet.add('e:' + e);
        });
        _myKhSetLen = mine.length + pendingQueue.length;
      }
      if (w.addedBy && w.addedBy === MAIN_USER) return true;
      var kh = (w.khmer || '').trim();
      if (kh) return _myKhSet.has('k:' + kh) || (w.id ? _myKhSet.has('i:' + w.id) : false);
      return _myKhSet.has('e:' + (w.english || '').trim().toLowerCase());
    }

    function showMoreRecent(first) {
      var recentEl = el('dash-recent');
      var more = el('dash-more-btn');
      if (!recentEl) return;
      var step = first === true ? DASH_RECENT_FIRST : dashRecentPage();
      var next = _dashRecentRows.slice(_dashRecentShown, _dashRecentShown + step);
      _dashRecentShown += next.length;
      next.forEach(function(r) {
          var item = document.createElement('div');
          item.className = 'dash-row-item';
          item.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="kh" style="color:var(--acc3);font-size:1rem">' + esc(r.khmer || '—') + '</span><span style="color:var(--dim);font-size:.68rem">' + esc(r.dateAdded || '') + '</span></div><div style="font-size:.78rem;color:var(--text)">' + esc(r.english || '—') + ' <span style="color:var(--dim);font-size:.68rem">by ' + esc(r.addedBy || '?') + '</span></div>';
          // Quick Add — shown on every recent word. Own / already-saved words show a badge instead.
          var addBtn = document.createElement('button');
          addBtn.type = 'button';
          addBtn.className = 'dash-quick-add';
          addBtn.style.cssText = 'margin-top:4px;padding:3px 8px;font-size:.7rem;background:rgba(20,184,166,.1);border:1px solid rgba(20,184,166,.3);border-radius:6px;color:#5eead4;cursor:pointer';
          if (isInMyWords(r)) {
            addBtn.disabled = true;
            addBtn.style.opacity = '.6';
            addBtn.textContent = '✓ In your list';
          } else {
            addBtn.textContent = '＋ Add to My Words';
          }
          (function(row, btn) {
            btn.onclick = function() {
              if (btn.disabled) return;
              if (isInMyWords(row)) { toast('Already in your list.', 'inf'); btn.disabled = true; btn.textContent = '✓ In your list'; return; }
              btn.disabled = true;
              btn.textContent = '⏳ Saving…';
              var res = addWordsToMySheet([row]);
              if (res.added) { btn.textContent = '✓ Added'; _myKhSet = null; }
              else if (res.skipped) { btn.textContent = '✓ In your list'; }
              else { btn.disabled = false; btn.textContent = '＋ Add to My Words'; }
              btn.style.opacity = btn.disabled ? '.6' : '1';
            };
          })(r, addBtn);
          item.appendChild(addBtn);
          recentEl.appendChild(item);
      });
      if (more) {
        var left = _dashRecentRows.length - _dashRecentShown;
        more.style.display = left > 0 ? 'block' : 'none';
        more.textContent = '⬇ Show ' + Math.min(dashRecentPage(), left) + ' more (' + left + ' left)';
      }
      var col = el('dash-collapse-btn');
      if (col) col.style.display = _dashRecentShown > DASH_RECENT_FIRST ? 'inline-flex' : 'none';
    }

    function buildReferencePages() {
      var allCons = [{
          kh: 'ក',
          ro: 'k',
          s: 1
        }, {
          kh: 'ខ',
          ro: 'kh',
          s: 1
        }, {
          kh: 'គ',
          ro: 'k/g',
          s: 2
        }, {
          kh: 'ឃ',
          ro: 'kh',
          s: 2
        }, {
          kh: 'ង',
          ro: 'ng',
          s: 2
        },
        {
          kh: 'ច',
          ro: 'ch',
          s: 1
        }, {
          kh: 'ឆ',
          ro: 'chh',
          s: 1
        }, {
          kh: 'ជ',
          ro: 'ch/j',
          s: 2
        }, {
          kh: 'ឈ',
          ro: 'chh',
          s: 2
        }, {
          kh: 'ញ',
          ro: 'ny',
          s: 2
        },
        {
          kh: 'ដ',
          ro: 'd',
          s: 1
        }, {
          kh: 'ឋ',
          ro: 'th',
          s: 1
        }, {
          kh: 'ឌ',
          ro: 'd',
          s: 2
        }, {
          kh: 'ឍ',
          ro: 'th',
          s: 2
        }, {
          kh: 'ណ',
          ro: 'n',
          s: 1
        },
        {
          kh: 'ត',
          ro: 't',
          s: 1
        }, {
          kh: 'ថ',
          ro: 'th',
          s: 1
        }, {
          kh: 'ទ',
          ro: 't/d',
          s: 2
        }, {
          kh: 'ធ',
          ro: 'th',
          s: 2
        }, {
          kh: 'ន',
          ro: 'n',
          s: 2
        },
        {
          kh: 'ប',
          ro: 'b/p',
          s: 1
        }, {
          kh: 'ផ',
          ro: 'ph',
          s: 1
        }, {
          kh: 'ព',
          ro: 'p/b',
          s: 2
        }, {
          kh: 'ភ',
          ro: 'ph',
          s: 2
        }, {
          kh: 'ម',
          ro: 'm',
          s: 2
        },
        {
          kh: 'យ',
          ro: 'y',
          s: 2
        }, {
          kh: 'រ',
          ro: 'r',
          s: 2
        }, {
          kh: 'ល',
          ro: 'l',
          s: 2
        }, {
          kh: 'វ',
          ro: 'v/w',
          s: 2
        },
        {
          kh: 'ស',
          ro: 's',
          s: 1
        }, {
          kh: 'ហ',
          ro: 'h',
          s: 1
        }, {
          kh: 'ឡ',
          ro: 'l',
          s: 1
        }, {
          kh: 'អ',
          ro: "'",
          s: 1
        }
      ];
      var depVow = [{
          kh: '◌ា',
          s1: 'aa',
          s2: 'ie',
          ex: '"aa" like sp*a* / "ie" like p*ie*r'
        },
        {
          kh: '◌ិ',
          s1: 'e',
          s2: 'i',
          ex: '"e" like b*e*t / "i" like f*ee*t'
        },
        {
          kh: '◌ី',
          s1: 'ey',
          s2: 'ii',
          ex: '"ey" like h*ey* / "ii" like s*ee*'
        },
        {
          kh: '◌ឹ',
          s1: 'eu',
          s2: 'eu',
          ex: '"eu" like h*er* (no English match)'
        },
        {
          kh: '◌ឺ',
          s1: 'eu (long)',
          s2: 'eu (long)',
          ex: '"eu" like h*er*, held longer'
        },
        {
          kh: '◌ុ',
          s1: 'o',
          s2: 'u',
          ex: '"o" like b*oo*k / "u" like b*oo*t'
        },
        {
          kh: '◌ូ',
          s1: 'ou',
          s2: 'uu',
          ex: '"ou" like b*oa*t / "uu" like b*oo*t'
        },
        {
          kh: '◌ួ',
          s1: 'ua',
          s2: 'ua',
          ex: '"ua" like t*ou*r'
        },
        {
          kh: '◌ើ',
          s1: 'ae',
          s2: 'oe',
          ex: '"ae" like wh*ere* / "oe" like h*er*'
        },
        {
          kh: '◌ែ',
          s1: 'ae',
          s2: 'ae',
          ex: '"ae" like b*are*'
        },
        {
          kh: '◌ៃ',
          s1: 'ai',
          s2: 'e',
          ex: '"ai" like Th*ai* / "e" like b*ed*'
        },
        {
          kh: '◌ោ',
          s1: 'ao',
          s2: 'oo',
          ex: '"ao" like M*ao* / "oo" like b*oo*t'
        },
        {
          kh: '◌ំ',
          s1: 'om',
          s2: 'um',
          ex: '"om" like b*om*b / "um" like g*um*'
        },
        {
          kh: '◌ះ',
          s1: 'ah',
          s2: 'eh',
          ex: 'Short final — cut off quickly'
        },
        {
          kh: '◌ាំ',
          s1: 'am',
          s2: 'eam',
          ex: '"am" like h*um* / "eam" like st*eam*'
        }
      ];
      var indVow = [{
        kh: 'ឣ',
        ro: 'a'
      }, {
        kh: 'ឤ',
        ro: 'aa'
      }, {
        kh: 'ឥ',
        ro: 'i'
      }, {
        kh: 'ឦ',
        ro: 'ii'
      }, {
        kh: 'ឧ',
        ro: 'u'
      }, {
        kh: 'ឩ',
        ro: 'uu'
      }, {
        kh: 'ឪ',
        ro: 'uv'
      }, {
        kh: 'ឫ',
        ro: 'ri'
      }, {
        kh: 'ឬ',
        ro: 'rii'
      }, {
        kh: 'ឭ',
        ro: 'le'
      }, {
        kh: 'ឮ',
        ro: 'lee'
      }, {
        kh: 'ឯ',
        ro: 'ae'
      }, {
        kh: 'ឰ',
        ro: 'ai'
      }, {
        kh: 'ឱ',
        ro: 'ao'
      }, {
        kh: 'ឲ',
        ro: 'au'
      }];
      var nums = [{
        kh: '០',
        word: 'សូន្យ',
        n: '0'
      }, {
        kh: '១',
        word: 'មួយ',
        n: '1'
      }, {
        kh: '២',
        word: 'ពីរ',
        n: '2'
      }, {
        kh: '៣',
        word: 'បី',
        n: '3'
      }, {
        kh: '៤',
        word: 'បួន',
        n: '4'
      }, {
        kh: '៥',
        word: 'ប្រាំ',
        n: '5'
      }, {
        kh: '៦',
        word: 'ប្រាំមួយ',
        n: '6'
      }, {
        kh: '៧',
        word: 'ប្រាំពីរ',
        n: '7'
      }, {
        kh: '៨',
        word: 'ប្រាំបី',
        n: '8'
      }, {
        kh: '៩',
        word: 'ប្រាំបួន',
        n: '9'
      }, {
        kh: '១០',
        word: 'ដប័',
        n: '10'
      }, {
        kh: '២០',
        word: 'ម្ភែ',
        n: '20'
      }, {
        kh: '៣០',
        word: 'សាមសិប',
        n: '30'
      }, {
        kh: '៤០',
        word: 'សែសិប',
        n: '40'
      }, {
        kh: '៥០',
        word: 'ហាសិប',
        n: '50'
      }, {
        kh: '៦០',
        word: 'ហុកសិប',
        n: '60'
      }, {
        kh: '៧០',
        word: 'ចិតសិប',
        n: '70'
      }, {
        kh: '៨០',
        word: 'ប័ែតសិប',
        n: '80'
      }, {
        kh: '៩០',
        word: 'កែសិប',
        n: '90'
      }, {
        kh: '១០០',
        word: 'មួយរយ',
        n: '100'
      }];
      var phrases = [{
          kh: 'ជំរាបសួរ',
          ro: 'jum reap suor',
          en: 'Hello (formal)'
        }, {
          kh: 'សួស្ដី',
          ro: 'suos dei',
          en: 'Hello (informal)'
        },
        {
          kh: 'អរគុណ',
          ro: 'aw kun',
          en: 'Thank you'
        }, {
          kh: 'សូមទោស',
          ro: 'som tooh',
          en: 'Sorry / Excuse me'
        },
        {
          kh: 'មិនអីទេ',
          ro: 'min ei te',
          en: 'No problem'
        }, {
          kh: 'ជំរាបលា',
          ro: 'jum reap lea',
          en: 'Goodbye (formal)'
        },
        {
          kh: 'លា​ហើយ',
          ro: 'lea haey',
          en: 'Bye (informal)'
        }, {
          kh: 'ចាស',
          ro: 'jas',
          en: 'Yes (female polite)'
        },
        {
          kh: 'បាទ',
          ro: 'baat',
          en: 'Yes (male polite)'
        }, {
          kh: 'ទេ',
          ro: 'te',
          en: 'No'
        },
        {
          kh: 'ខ្ញុំ',
          ro: "kh'nyom",
          en: 'I / me'
        }, {
          kh: 'អ្នក',
          ro: 'neak',
          en: 'You'
        },
        {
          kh: 'ភាសាខ្មែរ',
          ro: 'phiesa khmer',
          en: 'Khmer language'
        }, {
          kh: 'ខ្ញុំមិនយល់ទេ',
          ro: "kh'nyom min yol te",
          en: "I don't understand"
        },
        {
          kh: 'ប៉ុន្មាន?',
          ro: 'ponmaan?',
          en: 'How much?'
        }, {
          kh: 'ទីនេះ',
          ro: 'ti nih',
          en: 'Here'
        }, {
          kh: 'ទីនោះ',
          ro: 'ti noh',
          en: 'There'
        }
      ];
      var phoneticGroups = [{
          header: 'Long Vowels',
          rows: [{
              sym: 'ូ / oo',
              sound: 'oo',
              ex: 'like "b*oo*t"'
            },
            {
              sym: 'ី / ii',
              sound: 'ee',
              ex: 'like "f*ee*t"'
            },
            {
              sym: 'ា / aa',
              sound: 'aa',
              ex: 'like "f*a*ther"'
            },
            {
              sym: 'ែ / ae',
              sound: 'air',
              ex: 'like "*air*"'
            },
            {
              sym: 'ួ / ua',
              sound: 'oo-a',
              ex: 'like "t*ou*r"'
            }
          ]
        },
        {
          header: 'Short Vowels',
          rows: [{
              sym: 'ុ / o',
              sound: 'oo',
              ex: 'like "b*oo*k"'
            },
            {
              sym: 'ិ / e',
              sound: 'eh',
              ex: 'like "b*e*t"'
            },
            {
              sym: 'ឹ / eu',
              sound: 'er',
              ex: 'like "h*er*" (no lip rounding)'
            },
            {
              sym: 'ំ / om',
              sound: 'um',
              ex: 'like "g*um*" (nasal)'
            }
          ]
        },
        {
          header: 'Consonants — Stops',
          rows: [{
              sym: 'ក / k',
              sound: 'k',
              ex: 'hard "k" like "k*e*y"'
            },
            {
              sym: 'ប / p',
              sound: 'p/b',
              ex: '"p" at start, unreleased at end'
            },
            {
              sym: 'ត / t',
              sound: 't',
              ex: 'like "*t*op"'
            },
            {
              sym: 'ដ / d',
              sound: 'd',
              ex: 'like "*d*oor"'
            },
            {
              sym: 'ច / ch',
              sound: 'ch',
              ex: 'like "*ch*air"'
            }
          ]
        },
        {
          header: 'Consonants — Nasals & Approx.',
          rows: [{
              sym: 'ម / m',
              sound: 'm',
              ex: 'like "*m*oon"'
            },
            {
              sym: 'ន / n',
              sound: 'n',
              ex: 'like "*n*ow"'
            },
            {
              sym: 'ង / ng',
              sound: 'ng',
              ex: 'like "ri*ng*" — CAN start syllables!'
            },
            {
              sym: 'ញ / ny',
              sound: 'ny',
              ex: 'like "ca*ny*on"'
            },
            {
              sym: 'យ / y',
              sound: 'y',
              ex: 'like "*y*es"'
            },
            {
              sym: 'រ / r',
              sound: 'r',
              ex: 'soft "r" — sometimes silent at end'
            }
          ]
        },
        {
          header: 'Consonants — Fricatives',
          rows: [{
              sym: 'ស / s',
              sound: 's',
              ex: 'always sharp "s" like "*s*un" — never "z"'
            },
            {
              sym: 'ហ / h',
              sound: 'h',
              ex: 'like "*h*ello"'
            },
            {
              sym: 'វ / w',
              sound: 'w/v',
              ex: 'between English "w" and "v"'
            }
          ]
        },
        {
          header: 'Aspirated Consonants',
          rows: [{
              sym: 'ខ / kh',
              sound: 'kh',
              ex: '"k" + puff of air like "*kh*aki"'
            },
            {
              sym: 'ថ / th',
              sound: 'th',
              ex: 'NOT English "the" — say "t" + air, like "*T*hai"'
            },
            {
              sym: 'ភ / ph',
              sound: 'ph',
              ex: 'NOT "f" — say "p" + air, like "*P*hilip"'
            },
            {
              sym: 'ឆ / chh',
              sound: 'chh',
              ex: '"ch" + puff of air'
            }
          ]
        }
      ];

      function buildGrid5(id, items) {
        var g = el(id);
        if (!g) return;
        g.innerHTML = '';
        items.forEach(function(c) {
          var card = document.createElement('div');
          card.className = 'ref-card';
          var s1 = c.s === 1 ? '<div class="ref-ro" style="color:rgba(165,180,252,.5);font-size:.56rem">S1</div>' : c.s === 2 ? '<div class="ref-ro" style="color:rgba(192,132,252,.5);font-size:.56rem">S2</div>' : '';
          card.innerHTML = '<div class="ref-kh kh">' + c.kh + '</div><div class="ref-ro">' + c.ro + '</div>' + s1;
          (function(kh) {
            card.addEventListener('click', function() {
              speakKhmer(kh);
            });
          })(c.kh);
          card.title = 'Tap to hear';
          g.appendChild(card);
        });
      }
      window._refCons = allCons;
      window._refDepVow = depVow;
      window._refIndVow = indVow;
      window._refNums = nums;
      buildGrid5('ref-all-cons', allCons);
      var dvb = el('ref-dep-vowels');
      if (dvb) {
        dvb.innerHTML = '';
        depVow.forEach(function(v) {
          var tr = document.createElement('tr');
          tr.innerHTML = '<td class="vt-kh kh">' + v.kh + '</td><td class="vt-ro">' + v.s1 + '</td><td class="vt-ro">' + v.s2 + '</td><td class="vt-ex" style="white-space:normal;line-height:1.5">' + esc(v.ex) + '</td>';
          dvb.appendChild(tr);
        });
      }
      var pg = el('ref-phonetic-grid');
      if (pg) {
        pg.innerHTML = '';
        phoneticGroups.forEach(function(grp) {
          var card = document.createElement('div');
          card.className = 'ref-phonetic-card';
          var rowsHtml = grp.rows.map(function(r, idx) {
            return '<div class="rpc-row clickable" data-row="' + idx + '" title="Tap to hear"><span class="rpc-sym kh">' + r.sym.split(' / ')[0] + '</span><span class="rpc-sound">' + r.sound + '</span><span class="rpc-ex">' + esc(r.ex) + '</span></div>';
          }).join('');
          card.innerHTML = '<div class="rpc-header">' + esc(grp.header) + '</div>' + rowsHtml;
          card.querySelectorAll('.rpc-row').forEach(function(rel, i) {
            rel.style.cursor = 'pointer';
            rel.addEventListener('click', function() {
              var sym = (grp.rows[i].sym || '').split(' / ')[0].trim();
              if (/[\u1780-\u17FF]/.test(sym)) speakKhmer(sym);
            });
          });
          pg.appendChild(card);
        });
      }
      var ivg = el('ref-ind-vowels');
      if (ivg) {
        ivg.innerHTML = '';
        indVow.forEach(function(v) {
          var card = document.createElement('div');
          card.className = 'ref-card';
          card.innerHTML = '<div class="ref-kh kh">' + v.kh + '</div><div class="ref-ro">' + v.ro + '</div>';
          (function(kh) {
            card.addEventListener('click', function() {
              speakKhmer(kh);
            });
          })(v.kh);
          card.title = 'Tap to hear';
          ivg.appendChild(card);
        });
      }
      var ng = el('ref-numbers');
      if (ng) {
        ng.innerHTML = '';
        nums.forEach(function(n) {
          var card = document.createElement('div');
          card.className = 'ref-card';
          card.innerHTML = '<div class="ref-kh kh">' + n.kh + '</div>' + (n.word ? '<div class="ref-word kh">' + n.word + '</div>' : '') + '<div class="ref-ro">' + n.n + '</div>';
          (function(kh) {
            card.addEventListener('click', function() {
              speakKhmer(kh);
            });
          })(n.kh);
          card.title = 'Tap to hear';
          ng.appendChild(card);
        });
      }
      var pb = el('ref-phrases');
      if (pb) {
        pb.innerHTML = '';
        phrases.forEach(function(p) {
          var tr = document.createElement('tr');
          tr.style.cursor = 'pointer';
          tr.title = 'Tap to hear phrase';
          tr.innerHTML = '<td class="vt-kh kh" style="min-width:120px">' + p.kh + ' 🔊</td><td class="vt-ro">' + p.ro + '</td><td class="vt-ex">' + esc(p.en) + '</td>';
          tr.addEventListener('click', function() {
            speakKhmer(p.kh.split('/')[0].trim());
          });
          pb.appendChild(tr);
        });
      }
      renderSingKhmer();
    }


    var SING_KHMER_WORDS = [{
        en: 'to go',
        sk: 'tv'
      },
      {
        en: 'at',
        sk: 'nv'
      },
      {
        en: 'we',
        sk: 'yg'
      },
      {
        en: 'she/her him/he',
        sk: 'kort'
      },
      {
        en: 'difficult',
        sk: 'pibak'
      },
      {
        en: 'strong',
        sk: 'klang'
      },
      {
        en: 'although',
        sk: 'tous3'
      },
      {
        en: 'in order to',
        sk: 'derm3'
      },
      {
        en: 'excellent',
        sk: 'pukea'
      },
      {
        en: 'playing / hangout',
        sk: 'lg'
      },
      {
        en: 'sleep',
        sk: 'keng/kg'
      },
      {
        en: 'night / morning',
        sk: 'yub / prik'
      },
      {
        en: 'day time',
        sk: 'pel tngai'
      },
      {
        en: 'day',
        sk: 'tngai / ngai'
      },
      {
        en: 'since',
        sk: 'tang pi'
      },
      {
        en: 'from',
        sk: 'pi'
      },
      {
        en: 'truth / true',
        sk: 'pit'
      },
      {
        en: 'no',
        sk: 'ot'
      },
      {
        en: 'to know',
        sk: 'dg'
      },
      {
        en: 'ask',
        sk: 'sur'
      },
      {
        en: 'question',
        sk: 'somnur'
      },
      {
        en: 'sick',
        sk: 'chue'
      },
      {
        en: 'believe',
        sk: 'jue'
      },
      {
        en: 'hear',
        sk: 'lue'
      },
      {
        en: 'listen',
        sk: 'sdab'
      },
      {
        en: 'forget',
        sk: 'plex'
      },
      {
        en: 'stop',
        sk: 'chob'
      },
      {
        en: 'finish',
        sk: 'job'
      },
      {
        en: 'different',
        sk: 'pseng'
      },
      {
        en: 'word',
        sk: 'peak'
      },
      {
        en: 'place / put',
        sk: 'dak'
      },
      {
        en: 'leave',
        sk: 'jenh'
      },
      {
        en: 'eat',
        sk: 'nham'
      },
      {
        en: 'what',
        sk: 'ey'
      },
      {
        en: 'buy',
        sk: 'tinh / ting'
      },
      {
        en: 'learn',
        sk: 'rean / rien'
      },
      {
        en: 'amplifier',
        sk: 'mg'
      },
      {
        en: 'wait',
        sk: 'Jam'
      },
      {
        en: 'fun / happy',
        sk: 'sby jit / sby'
      },
      {
        en: 'sad',
        sk: 'sday'
      },
      {
        en: 'can / yes /',
        sk: 'Ban'
      },
      {
        en: 'what',
        sk: 'mix'
      },
      {
        en: 'no',
        sk: 'te'
      },
      {
        en: 'person',
        sk: 'nek'
      },
      {
        en: 'currently',
        sk: 'phg / pg'
      },
      {
        en: 'miss',
        sk: 'nirk / nik'
      },
      {
        en: 'find / search',
        sk: 'rk'
      },
      {
        en: 'give',
        sk: 'oy'
      },
      {
        en: 'will',
        sk: 'ng'
      },
      {
        en: 'where',
        sk: 'na'
      },
      {
        en: 'want',
        sk: 'jg'
      },
      {
        en: 'anything',
        sk: 'kor ban'
      },
      {
        en: 'all',
        sk: 'sos'
      },
      {
        en: 'me / i',
        sk: 'nh'
      },
      {
        en: 'already / and',
        sk: 'hz'
      },
      {
        en: 'only',
        sk: 'kron dae'
      },
      {
        en: 'but',
        sk: 'tea'
      },
      {
        en: 'also',
        sk: 'dae'
      },
      {
        en: 'also',
        sk: 'pg'
      },
      {
        en: '',
        sk: 'jos'
      },
      {
        en: 'broken',
        sk: 'khouch / khoch'
      },
      {
        en: 'like / alike',
        sk: 'doch'
      },
      {
        en: 'very',
        sk: 'nas'
      },
      {
        en: 'pretty',
        sk: 'sart'
      },
      {
        en: 'really',
        sk: 'Men'
      },
      {
        en: 'cool',
        sk: 'loy'
      },
      {
        en: 'that / which',
        sk: 'del'
      },
      {
        en: 'back (come)',
        sk: 'vinh'
      },
      {
        en: 'close',
        sk: 'jit'
      },
      {
        en: '',
        sk: 'kur oy'
      },
      {
        en: 'call',
        sk: 'hav'
      },
      {
        en: 'tired',
        sk: 'hort'
      },
      {
        en: 'love',
        sk: 'slanh / sl'
      },
      {
        en: 'eachother',
        sk: 'knea'
      },
      {
        en: 'go back',
        sk: 'tv vinh'
      },
      {
        en: 'come back',
        sk: 'tv mk'
      },
      {
        en: 'come',
        sk: 'mor'
      },
      {
        en: 'hit',
        sk: 'vei'
      },
      {
        en: 'who?',
        sk: 'na ke'
      },
      {
        en: 'have',
        sk: 'mean'
      },
      {
        en: 'mad',
        sk: 'khg'
      },
      {
        en: 'scared',
        sk: 'klach'
      },
      {
        en: 'first',
        sk: 'sin'
      },
      {
        en: 'because',
        sk: 'prous'
      },
      {
        en: 'now',
        sk: 'lv / alv'
      },
      {
        en: 'doubt',
        sk: 'songsei'
      },
      {
        en: 'bf / gf',
        sk: 'ss / sngsa'
      },
      {
        en: 'them / they',
        sk: 'puk kort'
      },
      {
        en: 'they / them',
        sk: 'puk ke'
      },
      {
        en: 'yourself / themselves',
        sk: 'eng'
      },
      {
        en: 'to know',
        sk: 'skol'
      },
      {
        en: 'siblings / relatives',
        sk: "p'o"
      },
      {
        en: 'what',
        sk: 'mix jg'
      },
      {
        en: 'what',
        sk: 'ei ke'
      },
      {
        en: 'when',
        sk: 'pel'
      },
      {
        en: 'next time',
        sk: 'lek kroy'
      },
      {
        en: 'shy',
        sk: 'ean'
      },
      {
        en: 'whatever',
        sk: 'pdoy'
      },
      {
        en: 'mom',
        sk: 'mak'
      },
      {
        en: 'dad',
        sk: 'pa'
      },
      {
        en: 'little bit / little more',
        sk: 'tic tt'
      },
      {
        en: 'little bit / little more',
        sk: 'tix tt'
      },
      {
        en: 'more',
        sk: 'tt'
      },
      {
        en: 'face',
        sk: 'mok'
      },
      {
        en: 'possible',
        sk: 'tver ban'
      },
      {
        en: 'good',
        sk: 'laor'
      },
      {
        en: 'not good',
        sk: 'ot laor'
      },
      {
        en: 'endure',
        sk: 'susu'
      },
      {
        en: 'please / request',
        sk: 'som'
      },
      {
        en: 'one more',
        sk: 'muy tt'
      },
      {
        en: 'Elder Eav',
        sk: 'steav'
      },
      {
        en: 'cringe',
        sk: 'jor'
      },
      {
        en: 'what happened?',
        sk: 'kert ei'
      },
      {
        en: 'close to arriving',
        sk: 'jit dol'
      },
      {
        en: 'arrive',
        sk: 'mk dol'
      },
      {
        en: 'already / and',
        sk: 'hz'
      },
      {
        en: 'sleep',
        sk: 'dek'
      },
      {
        en: 'follow',
        sk: 'tam'
      },
      {
        en: 'to do',
        sk: 'tver'
      },
      {
        en: 'take',
        sk: 'yk'
      },
      {
        en: 'walk',
        sk: 'Der'
      },
      {
        en: 'one person',
        sk: 'mnek'
      },
      {
        en: 'this',
        sk: 'nis'
      },
      {
        en: 'that',
        sk: 'nos'
      },
      {
        en: 'long',
        sk: 'yu'
      },
      {
        en: 'amplifier',
        sk: 'mes'
      },
      {
        en: 'hour',
        sk: 'mong / mrg'
      },
      {
        en: 'to wear',
        sk: 'pek'
      },
      {
        en: 'word',
        sk: 'peak'
      },
      {
        en: 'shirt',
        sk: 'av'
      },
      {
        en: 'pant',
        sk: 'kav'
      },
      {
        en: 'color',
        sk: 'por'
      },
      {
        en: 'all',
        sk: 'sos'
      },
      {
        en: 'skin / meat',
        sk: 'sach'
      },
      {
        en: 'that',
        sk: 'tha / ta'
      },
      {
        en: 'a lot',
        sk: 'jrern'
      },
      {
        en: 'busy',
        sk: 'rvol'
      },
      {
        en: 'wet',
        sk: 'serm'
      },
      {
        en: 'laugh',
        sk: 'serch'
      },
      {
        en: 'used to',
        sk: 'thlerp'
      },
      {
        en: 'dont',
        sk: 'Kom'
      },
      {
        en: 'understand',
        sk: 'yol'
      },
      {
        en: 'with',
        sk: 'jmuy'
      },
      {
        en: 'correct',
        sk: 'trov / trv'
      },
      {
        en: 'see / look',
        sk: 'khernh'
      },
      {
        en: 'watch',
        sk: 'merl'
      },
      {
        en: 'feeling',
        sk: 'ahrom'
      },
      {
        en: 'of',
        sk: 'rbos / bos'
      },
      {
        en: 'people',
        sk: 'mnus'
      },
      {
        en: 'in',
        sk: 'kng'
      },
      {
        en: 'fast',
        sk: 'luen'
      },
      {
        en: 'go up / build up',
        sk: 'lerg'
      },
      {
        en: 'is like',
        sk: 'doch jea'
      },
      {
        en: 'care',
        sk: 'kvol'
      },
      {
        en: 'work',
        sk: 'trov ka'
      },
      {
        en: 'need',
        sk: 'tver ka'
      },
      {
        en: 'happen / cause to happen',
        sk: 'kert ot'
      },
      {
        en: 'market',
        sk: 'psa'
      },
      {
        en: 'not necessary',
        sk: 'min bach'
      },
      {
        en: 'to',
        sk: 'dol'
      },
      {
        en: 'easy',
        sk: 'srol'
      },
      {
        en: 'before',
        sk: 'mun'
      },
      {
        en: 'if',
        sk: 'ber'
      },
      {
        en: 'meet',
        sk: 'joub'
      },
      {
        en: 'place',
        sk: 'k\'leng'
      },
      {
        en: 'where?',
        sk: 'mean na'
      },
      {
        en: 'tell',
        sk: 'brb'
      },
      {
        en: 'new',
        sk: 'thmey/ t\'mey'
      },
      {
        en: 'old',
        sk: 'jas'
      },
      {
        en: 'lazy',
        sk: 'kill'
      },
      {
        en: 'always / forever',
        sk: 'rhot'
      },
      {
        en: 'haven\'t for a while',
        sk: 'kha'
      },
      {
        en: 'it',
        sk: 'via / vea'
      },
      {
        en: 'amplifier',
        sk: 'tas'
      },
      {
        en: 'amplifier',
        sk: 'ter'
      },
      {
        en: 'hungry',
        sk: 'klean'
      },
      {
        en: 'dead',
        sk: 'ngoub'
      },
      {
        en: 'dead',
        sk: 'slab'
      },
      {
        en: 'lie',
        sk: 'kohok'
      },
      {
        en: 'normal',
        sk: 'tmd'
      },
      {
        en: 'thank you',
        sk: 'arkun'
      },
      {
        en: 'alright / already',
        sk: 'ng hx'
      },
      {
        en: 'swallow',
        sk: 'leb'
      },
      {
        en: 'medicine',
        sk: 'thnam / tnam'
      },
      {
        en: 'not yet',
        sk: 'ot torn'
      },
      {
        en: 'just barely',
        sk: 'minh'
      },
      {
        en: 'help',
        sk: 'jouy'
      },
      {
        en: '(last)( night',
        sk: 'yub (menh)'
      },
      {
        en: 'because',
        sk: 'doy sa / douy sa'
      },
      {
        en: 'money',
        sk: 'luy'
      },
      {
        en: 'think',
        sk: 'kit'
      },
      {
        en: 'thinking',
        sk: 'ka kit'
      },
      {
        en: 'save',
        sk: 'tok'
      },
      {
        en: 'delicious',
        sk: 'chnganh'
      },
      {
        en: 'wonder',
        sk: 'chngol'
      },
      {
        en: 'far',
        sk: 'chngay'
      },
      {
        en: 'sorry',
        sk: 'somtus'
      },
      {
        en: 'just did',
        sk: 'terb'
      }
    ];


    // Case-, diacritic-, apostrophe- and spacing-insensitive form used by all fuzzy searches.
    // Extra shorthand entries (added only when not already in the base list).
    (function() {
      var more = [
      { en: 'eat (rice)', sk: 'nham bai' },
      { en: 'hot', sk: 'kdav' },
      { en: 'cold', sk: 'trojeak' },
      { en: 'beautiful', sk: 'saat' },
      { en: 'hello', sk: 'jumreap sur / jrs' },
      { en: 'how are you / well', sk: 'sok sabay / ss' },
      { en: 'goodbye', sk: 'lea sen hz' },
      { en: "it's nothing / you're welcome", sk: 'ot ey te' },
      { en: 'cannot', sk: 'ot ban' },
      { en: 'expensive', sk: 'tlai' },
      { en: 'cheap', sk: 'thok' },
      { en: 'house', sk: 'pteah' },
      { en: 'today', sk: 'tngai nis' },
      { en: 'yesterday', sk: 'msel minh' },
      { en: 'tomorrow', sk: 'saek' },
      { en: 'now', sk: 'ylov / lv nis' },
      { en: 'sick', sk: 'chheu' },
      { en: 'teacher', sk: 'nek kru' },
      { en: 'school', sk: 'sala' },
      { en: 'water', sk: 'tuk' },
      { en: 'rice', sk: 'bai' },
      { en: 'mother', sk: 'mae / mdai' },
      { en: 'father', sk: 'pa / ovpuk' },
      { en: 'older sibling', sk: 'bong' },
      { en: 'younger sibling', sk: 'oun' },
      { en: 'friend', sk: 'mit' },
      { en: 'where are you going?', sk: 'tv na' },
      { en: 'where from?', sk: 'mk pi na' },
      { en: "don't have", sk: 'kmean' },
      { en: 'fast', sk: 'luen' },
      { en: 'slow', sk: 'yerd' },
      { en: 'big', sk: 'thom' },
      { en: 'small', sk: 'touch' },
      { en: 'a little', sk: 'bontech' },
      { en: 'good', sk: 'laor / l' },
      { en: 'bad', sk: 'akrak' },
      { en: 'happy', sk: 'sabay' },
      { en: 'sad', sk: 'pruy' },
      { en: 'who', sk: 'nek na' },
      { en: 'how much', sk: 'ponman' },
      { en: 'when', sk: 'pel na' },
      { en: 'why', sk: 'het ey' },
      { en: 'how', sk: 'yang mech / ym' },
      { en: 'okay', sk: 'ok / ban' }
      ];
      var have = {};
      SING_KHMER_WORDS.forEach(function(w) { have[String(w.sk).toLowerCase().trim()] = 1; });
      more.forEach(function(w) { if (!have[w.sk.toLowerCase()]) SING_KHMER_WORDS.push(w); });
    })();

    // 9.0.5: song terms, musical vocabulary and poetic lyric phrases
    (function() {
      var more = [
        { en: 'song (n.) — a piece of music with words', sk: 'chompeng' },
        { en: 'to sing (v.)', sk: 'chrieng' },
        { en: 'singer (n.)', sk: 'nek chrieng' },
        { en: 'music (n.)', sk: 'tontrey' },
        { en: 'musician (n.)', sk: 'tontrey kor' },
        { en: 'melody / tune (n.)', sk: 'bot pleng' },
        { en: 'lyrics / song words (n.)', sk: 'piek chrieng' },
        { en: 'rhythm / beat (n.)', sk: 'chongvak' },
        { en: 'voice (n.)', sk: 'samleng' },
        { en: 'to dance (v.)', sk: 'rom' },
        { en: 'traditional circle dance (n.)', sk: 'romvong' },
        { en: 'drum (n.)', sk: 'skor' },
        { en: 'guitar (n.)', sk: 'ki-ta' },
        { en: 'chorus / refrain (n.)', sk: 'bot ban' },
        { en: 'verse / stanza (n.)', sk: 'khlong' },
        { en: 'poem / poetry (n.)', sk: 'kamnap' },
        { en: 'hymn / sacred song (n.)', sk: 'tumnuk tumkeng' },
        { en: 'loud (adj.)', sk: 'klang' },
        { en: 'soft / gentle (adj.)', sk: 'tun' },
        { en: 'beautiful (of a voice or song) (adj.)', sk: 'pirus' },
        { en: 'to listen (v.)', sk: 'sdap' },
        { en: 'to play (an instrument) (v.)', sk: 'leng' },
        { en: 'heart (poetic) (n.)', sk: 'besdong' },
        { en: 'my beloved (lyric phrase)', sk: 'oun samlanh' },
        { en: 'love song (n.)', sk: 'chompeng sneha' },
        { en: 'I miss you (lyric phrase)', sk: 'nirk oun' },
        { en: 'forever (lyric phrase)', sk: 'rohot' },
        { en: 'moonlight (poetic) (n.)', sk: 'pon-leu khae' },
        { en: 'tears (n.)', sk: 'tuk pnek' },
        { en: 'dream (n./v.)', sk: 'sobin' },
        { en: 'sing together (phrase)', sk: 'chrieng chea muoy knea' },
        { en: 'to praise / worship (v.)', sk: 'sorsor' }
      ];
      var have = {};
      SING_KHMER_WORDS.forEach(function(w) { have[String(w.sk).toLowerCase().trim()] = 1; });
      more.forEach(function(w) { if (!have[w.sk.toLowerCase()]) { have[w.sk.toLowerCase()] = 1; SING_KHMER_WORDS.push(w); } });
    })();

    function normSearch(v) {
      v = String(v || '').toLowerCase();
      try { v = v.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
      return v.replace(/[\u2018\u2019'`\u00b4]/g, '').replace(/[^\p{L}\p{N}\s/]/gu, ' ').replace(/\s+/g, ' ').trim();
    }
    // q's letters appear in order inside s (e.g. "kg" -> "keng")
    function fuzzySubseq(q, s) {
      q = q.replace(/\s/g, ''); s = s.replace(/\s/g, '');
      if (!q) return true;
      var j = 0;
      for (var i = 0; i < s.length && j < q.length; i++) if (s[i] === q[j]) j++;
      return j === q.length;
    }
    function editDist(a, b, max) {
      if (Math.abs(a.length - b.length) > max) return max + 1;
      var prev = [], cur, i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {
        cur = [i];
        var rowMin = i;
        for (j = 1; j <= b.length; j++) {
          cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          if (cur[j] < rowMin) rowMin = cur[j];
        }
        if (rowMin > max) return max + 1;
        prev = cur;
      }
      return prev[b.length];
    }
    // Pre-normalised index, built once.
    var _skIndex = null;
    function skIndex() {
      if (_skIndex) return _skIndex;
      _skIndex = SING_KHMER_WORDS.map(function(w) {
        var variants = String(w.sk || '').split('/').map(normSearch).filter(Boolean);
        var enParts = normSearch(w.en).split(/[\s/]+/).filter(Boolean);
        return { w: w, sk: variants, skJoined: variants.join(' '), en: normSearch(w.en), enParts: enParts };
      });
      return _skIndex;
    }
    // Score one entry for a query: higher is better, 0 = no match.
    function skScore(e, q) {
      var best = 0, qc = q.replace(/\s/g, '');
      e.sk.forEach(function(v) {
        var vc = v.replace(/\s/g, '');
        if (v === q || vc === qc) best = Math.max(best, 100);
        else if (vc.indexOf(qc) === 0) best = Math.max(best, 80);
        else if (vc.indexOf(qc) !== -1) best = Math.max(best, 60);
        else if (qc.length >= 3 && editDist(qc, vc, 1) <= 1) best = Math.max(best, 45);
        else if (qc.length >= 2 && fuzzySubseq(qc, vc)) best = Math.max(best, 25);
      });
      if (e.en === q) best = Math.max(best, 95);
      else if (e.enParts.indexOf(q) !== -1) best = Math.max(best, 85);
      else if (e.enParts.some(function(p) { return p.indexOf(q) === 0; })) best = Math.max(best, 70);
      else if (e.en.indexOf(q) !== -1) best = Math.max(best, 55);
      else if (q.length >= 4 && e.enParts.some(function(p) { return editDist(q, p, 1) <= 1; })) best = Math.max(best, 40);
      return best;
    }
    function skFind(tok) {
      var bestE = null, bestS = 0;
      skIndex().forEach(function(e) {
        var sc = 0;
        e.sk.forEach(function(v) { if (v === tok || v.replace(/\s/g, '') === tok) sc = 100; });
        if (!sc && tok.length >= 3) e.sk.forEach(function(v) { if (editDist(tok, v.replace(/\s/g, ''), 1) <= 1) sc = Math.max(sc, 50); });
        if (sc > bestS) { bestS = sc; bestE = e; }
      });
      return bestE ? bestE.w : null;
    }

    var _skTimer = null;
    function renderSingKhmer() {
      clearTimeout(_skTimer);
      _skTimer = setTimeout(_renderSingKhmerNow, 60); // debounce typing
    }
    function _renderSingKhmerNow() {
      var box = el('ref-sing-khmer'),
        noteBox = el('sk-translate-note');
      if (!box) return;
      var raw = (el('sk-search') || {}).value || '';
      var q = normSearch(raw);
      var list = SING_KHMER_WORDS;
      if (noteBox) noteBox.innerHTML = '';
      if (q) {
        var scored = skIndex().map(function(e) { return { w: e.w, s: skScore(e, q) }; })
          .filter(function(x) { return x.s > 0; })
          .sort(function(a, b) { return b.s - a.s; });
        list = scored.map(function(x) { return x.w; });
        var tokens = q.split(' ').filter(Boolean);
        if (tokens.length > 1) {
          // Chained decode: "ot mean" -> "no / not" + "have"
          var hits = tokens.map(skFind);
          if (hits.every(Boolean)) {
            if (noteBox) noteBox.innerHTML = '<div class="sk-translate">Chained match for "' + esc(raw.trim()) + '": <b>' + hits.map(function(h) { return esc(h.en || h.sk); }).join(' ') + '</b></div>';
            var seen = {};
            list = hits.concat(list).filter(function(w) { if (seen[w.sk + '|' + w.en]) return false; seen[w.sk + '|' + w.en] = 1; return true; });
          }
        }
      }
      box.innerHTML = '';
      if (!list.length) {
        box.innerHTML = '<div class="ref-sk-empty">No matches.</div>';
        return;
      }
      var frag = document.createDocumentFragment();
      list.forEach(function(w) {
        var row = document.createElement('div');
        row.className = 'ref-sk-row';
        row.innerHTML = '<span class="sk-en">' + esc(w.en || '—') + '</span><span class="sk-ro">' + esc(w.sk) + '</span>';
        frag.appendChild(row);
      });
      box.appendChild(frag);
    }

    // ══════════ Translation engine (9.0.5) ══════════
    // Multi-source parallel lookup → consensus "Smart Card" + verification drawer.
    var TRANS_HIST_KEY = '__kv_trans_history';
    var TRANS_TIMEOUT_MS = 4000;
    var dictState = {
      query: '',
      sourceLang: 'en',
      targetLang: 'km',
      apiResults: {},
      consensus: null,
      reqId: 0,
      drawerOpen: false
    };

    function dictIsKhmer(text) {
      return /[\u1780-\u17FF]/.test(text || '');
    }

    function dictClean(text) {
      if (!text) return '';
      var d = document.createElement('div');
      d.innerHTML = String(text).replace(/\[([^\]]+)\]/g, '$1');
      return (d.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function dictNorm(t) {
      return String(t || '').toLowerCase().replace(/[.!?។៕,"'“”]+$/g, '').replace(/^[“"']+/, '').replace(/\s+/g, ' ').trim();
    }

    // fetch with a hard 4s AbortController timeout; turns CORS / rate-limit failures into readable errors
    function transFetchJson(url) {
      var ctl = new AbortController();
      var timer = setTimeout(function() { ctl.abort(); }, TRANS_TIMEOUT_MS);
      return fetch(url, { signal: ctl.signal }).then(function(r) {
        if (r.status === 429) throw new Error('Rate limited (429)');
        if (r.status === 404) throw new Error('No entry (404)');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch(function(e) {
        if (e && e.name === 'AbortError') throw new Error('Timed out (4s)');
        if (e instanceof TypeError) throw new Error('Blocked (CORS / offline)');
        throw e;
      }).finally(function() { clearTimeout(timer); });
    }

    // ── Engine 1: Google (dt=t, bd, ex, rm) ──
    async function transGoogle(text, sl, tl) {
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + tl + '&dt=t&dt=bd&dt=ex&dt=rm&q=' + encodeURIComponent(text);
      var d = await transFetchJson(url);
      var out = { translation: '', alts: [], pos: [], defs: [], examples: [], roman: '', srcRoman: '' };
      (d[0] || []).forEach(function(seg) {
        if (!seg) return;
        if (seg[0]) out.translation += seg[0];
        else {
          if (seg[2]) out.roman = seg[2];
          if (seg[3]) out.srcRoman = seg[3];
        }
      });
      out.translation = out.translation.trim();
      (d[1] || []).forEach(function(b) {
        if (!b || !b[0]) return;
        out.pos.push(b[0]);
        var terms = (b[1] || []).slice(0, 6);
        terms.forEach(function(t) { if (out.alts.indexOf(t) === -1) out.alts.push(t); });
        if (terms.length) out.defs.push({ pos: b[0], text: terms.join(', ') });
      });
      var ex = d[13] && d[13][0];
      if (ex) ex.slice(0, 3).forEach(function(x) { if (x && x[0]) out.examples.push({ src: dictClean(x[0]), tr: '', from: 'Google' }); });
      if (!out.translation) throw new Error('Empty response');
      out.confidence = 'Primary';
      return out;
    }

    // ── Engine 2: MyMemory ──
    async function transMyMemory(text, sl, tl) {
      var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + sl + '|' + tl + '&de=khmerspark@local.dev';
      var d = await transFetchJson(url);
      if (!d || !d.responseData) throw new Error('Bad response');
      if (d.responseStatus && +d.responseStatus !== 200) throw new Error(String(d.responseDetails || ('Status ' + d.responseStatus)).slice(0, 60));
      var tr = dictClean(d.responseData.translatedText);
      if (!tr || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(tr)) throw new Error('Quota reached');
      var alts = [];
      (d.matches || []).forEach(function(m) {
        var t = dictClean(m.translation);
        if (t && dictNorm(t) !== dictNorm(tr) && alts.indexOf(t) === -1) alts.push(t);
      });
      var q = d.responseData.match;
      return { translation: tr, alts: alts.slice(0, 5), pos: [], defs: [], examples: [], confidence: q != null ? Math.round(q * 100) + '% match' : '' };
    }

    // ── Engine 3: Lingva (primary mirror, then fallback) ──
    async function transLingva(text, sl, tl) {
      var hosts = ['https://lingva.lunar.icu', 'https://translate.plausibility.cloud'], lastErr;
      for (var i = 0; i < hosts.length; i++) {
        try {
          var d = await transFetchJson(hosts[i] + '/api/v1/' + sl + '/' + tl + '/' + encodeURIComponent(text));
          if (!d || !d.translation) throw new Error('Empty response');
          var out = { translation: d.translation.trim(), alts: [], pos: [], defs: [], examples: [], confidence: i ? 'Fallback mirror' : '' };
          var info = d.info || {};
          (info.extraTranslations || []).forEach(function(x) {
            if (x.type) out.pos.push(x.type);
            (x.list || []).slice(0, 4).forEach(function(w) { if (w.word && out.alts.indexOf(w.word) === -1) out.alts.push(w.word); });
          });
          (info.examples || []).slice(0, 2).forEach(function(x) { out.examples.push({ src: dictClean(x), tr: '', from: 'Lingva' }); });
          if (info.pronunciation && info.pronunciation.translation) out.roman = info.pronunciation.translation;
          if (info.pronunciation && info.pronunciation.query) out.srcRoman = info.pronunciation.query;
          return out;
        } catch (e) { lastErr = e; }
      }
      throw lastErr || new Error('Unavailable');
    }

    // ── Engine 4: Wiktionary definitions ──
    async function transWiktionary(text, sl) {
      if (text.split(/\s+/).length > 3) throw new Error('Skipped (phrase)');
      var d = await transFetchJson('https://en.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(text));
      var entries = d[sl] || d.en || [];
      if (!entries.length) throw new Error('No ' + (sl === 'km' ? 'Khmer' : 'English') + ' entry');
      var out = { translation: '', alts: [], pos: [], defs: [], examples: [], notes: [] };
      entries.slice(0, 4).forEach(function(en) {
        if (en.partOfSpeech && out.pos.indexOf(en.partOfSpeech) === -1) out.pos.push(en.partOfSpeech);
        (en.definitions || []).slice(0, 3).forEach(function(df) {
          var t = dictClean(df.definition);
          if (!t) return;
          out.defs.push({ pos: en.partOfSpeech || '', text: t });
          (df.examples || []).slice(0, 1).forEach(function(x) {
            var ex = dictClean(x);
            if (ex) out.examples.push({ src: ex, tr: '', from: 'Wiktionary' });
          });
          (df.parsedExamples || []).slice(0, 1).forEach(function(x) {
            if (x.example) out.examples.push({ src: dictClean(x.example), tr: dictClean(x.translation || ''), from: 'Wiktionary' });
          });
        });
      });
      // For Khmer headwords the first gloss is effectively an English translation
      if (sl === 'km' && out.defs[0]) out.translation = out.defs[0].text.split(/[;,(]/)[0].trim();
      return out;
    }

    // ── Engine 5: Local deck + built-in offline mini dictionary ──
    var OFFLINE_DICT = [
      ['hello', 'សួស្ដី', 'suosdei', 'Interjection'], ['thank you', 'អរគុណ', 'arkun', 'Phrase'],
      ['yes (male)', 'បាទ', 'baat', 'Particle'], ['yes (female)', 'ចាស', 'chaa', 'Particle'],
      ['no', 'ទេ', 'te', 'Particle'], ['water', 'ទឹក', 'tuk', 'Noun'], ['rice', 'បាយ', 'bay', 'Noun'],
      ['to eat', 'ញ៉ាំ', 'nyam', 'Verb'], ['to drink', 'ផឹក', 'phuk', 'Verb'], ['to go', 'ទៅ', 'tov', 'Verb'],
      ['to come', 'មក', 'mok', 'Verb'], ['to sleep', 'គេង', 'keng', 'Verb'], ['to love', 'ស្រលាញ់', 'srolanh', 'Verb'],
      ['good', 'ល្អ', 'l\'or', 'Adjective'], ['big', 'ធំ', 'thom', 'Adjective'], ['small', 'តូច', 'touch', 'Adjective'],
      ['house', 'ផ្ទះ', 'ptah', 'Noun'], ['friend', 'មិត្ត', 'mit', 'Noun'], ['mother', 'ម្ដាយ', 'mday', 'Noun'],
      ['father', 'ឪពុក', 'aupuk', 'Noun'], ['I / me', 'ខ្ញុំ', 'knhom', 'Pronoun'], ['you', 'អ្នក', 'neak', 'Pronoun'],
      ['today', 'ថ្ងៃនេះ', 'thngai nih', 'Noun'], ['tomorrow', 'ថ្ងៃស្អែក', 'thngai saek', 'Noun'],
      ['how much', 'ប៉ុន្មាន', 'ponman', 'Phrase'], ['delicious', 'ឆ្ងាញ់', 'chngagn', 'Adjective'],
      ['happy', 'សប្បាយ', 'sabay', 'Adjective'], ['song', 'ចម្រៀង', 'chamrieng', 'Noun'], ['to sing', 'ច្រៀង', 'chrieng', 'Verb'],
      ['music', 'តន្ត្រី', 'tontrey', 'Noun'], ['book', 'សៀវភៅ', 'siavphov', 'Noun'], ['money', 'លុយ', 'luy', 'Noun'],
      ['please', 'សូម', 'som', 'Particle'], ['sorry', 'សុំទោស', 'som tos', 'Phrase'], ['goodbye', 'លាហើយ', 'lea haey', 'Phrase']
    ];

    function transLocalLookup(text, sl) {
      var q = dictNorm(text), hit = null;
      (allRows || []).some(function(r) {
        var k = dictNorm(r.khmer), en = dictNorm(r.english);
        if ((sl === 'km' && k === q) || (sl !== 'km' && en === q)) { hit = r; return true; }
        return false;
      });
      if (hit) return {
        translation: sl === 'km' ? (hit.english || '') : (hit.khmer || ''),
        roman: hit.romanization || '', notes: hit.notes || '', category: getWordCategories(hit)[0],
        alts: [], pos: [], defs: hit.notes ? [{ pos: 'Your note', text: hit.notes }] : [], examples: [], confidence: 'In your deck', inDeck: true
      };
      var o = OFFLINE_DICT.filter(function(x) {
        return sl === 'km' ? dictNorm(x[1]) === q : (dictNorm(x[0]) === q || dictNorm(x[0].replace(/^to /, '')) === q);
      })[0];
      if (o) return { translation: sl === 'km' ? o[0] : o[1], roman: o[2], pos: [o[3]], alts: [], defs: [], examples: [], confidence: 'Offline dictionary' };
      return null;
    }

    // standalone meaning for a single Khmer segment (deck first, then offline list)
    function transSegmentInfo(word) {
      var r = transLocalLookup(word, 'km');
      return r ? { en: r.translation, ro: r.roman || transRomanize(word), inDeck: !!r.inDeck } : { en: '', ro: transRomanize(word), inDeck: false };
    }

    // ── Rule-based romanization fallback (approximate) ──
    var KM_CONS = { 'ក':'k','ខ':'kh','គ':'k','ឃ':'kh','ង':'ng','ច':'ch','ឆ':'chh','ជ':'ch','ឈ':'chh','ញ':'nh','ដ':'d','ឋ':'th','ឌ':'d','ឍ':'th','ណ':'n','ត':'t','ថ':'th','ទ':'t','ធ':'th','ន':'n','ប':'b','ផ':'ph','ព':'p','ភ':'ph','ម':'m','យ':'y','រ':'r','ល':'l','វ':'v','ស':'s','ហ':'h','ឡ':'l','អ':'' };
    var KM_VOW = { 'ា':'a','ិ':'e','ី':'ei','ឹ':'oe','ឺ':'eu','ុ':'o','ូ':'ou','ួ':'uo','ើ':'aeu','ឿ':'oea','ៀ':'ie','េ':'e','ែ':'ae','ៃ':'ai','ោ':'ao','ៅ':'au','ំ':'m','ះ':'h','ៈ':'a' };
    var KM_INDEP = { 'ឥ':'e','ឦ':'ei','ឧ':'o','ឩ':'ou','ឪ':'au','ឫ':'rue','ឬ':'rue','ឭ':'lue','ឮ':'lue','ឯ':'ae','ឰ':'ai','ឱ':'ao','ឳ':'au' };
    function transRomanize(text) {
      var out = '', prevCons = false;
      Array.from(String(text || '')).forEach(function(ch, i, arr) {
        if (ch === '្') { prevCons = false; return; }
        if (KM_CONS.hasOwnProperty(ch)) {
          var nxt = arr[i + 1];
          if (prevCons && nxt !== '្') out += 'a';
          out += KM_CONS[ch]; prevCons = !(nxt && KM_VOW[nxt]);
          return;
        }
        if (KM_VOW[ch]) { out += KM_VOW[ch]; prevCons = false; return; }
        if (KM_INDEP[ch]) { out += KM_INDEP[ch]; prevCons = false; return; }
        if (/[\u17B4-\u17DD]/.test(ch)) return; // other signs
        if (/\s/.test(ch)) out += ' ';
        else if (!/[\u1780-\u17FF]/.test(ch)) out += ch;
        prevCons = false;
      });
      return out.replace(/\s+/g, ' ').trim();
    }

    // ── Social register heuristics ──
    function transRegister(kh, defsText) {
      var t = String(defsText || '').toLowerCase();
      if (/\bliterary\b|\bpoetic\b/.test(t) || /ដ៏|ក្រៃលែង|ឱ\s/.test(kh)) return 'Literary';
      if (/\bformal\b|\bpolite\b|\broyal\b/.test(t) || /សូម|លោក|អ្នកស្រី|ព្រះ|បាទ|ចាស/.test(kh)) return 'Polite/Formal';
      if (/\bslang\b|\bcolloquial\b/.test(t) || /ហ្នឹង|អេះ|ណា៎|អត់/.test(kh)) return 'Colloquial';
      if (/\binformal\b/.test(t) || /ញ៉ាំ|អាញ|ឯង/.test(kh)) return 'Casual';
      return '';
    }

    // ── Numbers ──
    var KM_DIGITS = '០១២៣៤៥៦៧៨៩';
    var KM_NUM_WORDS = ['សូន្យ', 'មួយ', 'ពីរ', 'បី', 'បួន', 'ប្រាំ', 'ប្រាំមួយ', 'ប្រាំពីរ', 'ប្រាំបី', 'ប្រាំបួន'];
    var KM_TENS = ['', 'ដប់', 'ម្ភៃ', 'សាមសិប', 'សែសិប', 'ហាសិប', 'ហុកសិប', 'ចិតសិប', 'ប៉ែតសិប', 'កៅសិប'];
    function toKhmerDigits(s) { return String(s).replace(/[0-9]/g, function(d) { return KM_DIGITS[+d]; }); }
    function toArabicDigits(s) { return String(s).replace(/[០-៩]/g, function(d) { return String(KM_DIGITS.indexOf(d)); }); }
    function khmerNumberWords(n) {
      n = Math.floor(Math.abs(n));
      if (n === 0) return KM_NUM_WORDS[0];
      if (n >= 1e6) {
        var m = Math.floor(n / 1e6), r = n % 1e6;
        return khmerNumberWords(m) + 'លាន' + (r ? khmerNumberWords(r) : '');
      }
      var parts = '', units = [[100000, 'សែន'], [10000, 'ម៉ឺន'], [1000, 'ពាន់'], [100, 'រយ']];
      units.forEach(function(u) {
        var d = Math.floor(n / u[0]) % 10;
        if (d) parts += KM_NUM_WORDS[d] + u[1];
      });
      var rest = n % 100;
      if (rest >= 10) parts += KM_TENS[Math.floor(rest / 10)] + (rest % 10 ? KM_NUM_WORDS[rest % 10] : '');
      else if (rest) parts += KM_NUM_WORDS[rest];
      return parts;
    }
    function transNumberInfo(text) {
      var m = String(text).match(/[0-9០-៩][0-9០-៩,]*/);
      if (!m) return null;
      var arabic = toArabicDigits(m[0]).replace(/,/g, '');
      if (!arabic || arabic.length > 15) return null;
      var n = parseInt(arabic, 10);
      if (isNaN(n)) return null;
      return { arabic: arabic, khmer: toKhmerDigits(arabic), words: khmerNumberWords(n) };
    }

    // ── Word segmentation ──
    function transSegment(text) {
      if (!dictIsKhmer(text) || !(window.Intl && Intl.Segmenter)) return [];
      try {
        var seg = new Intl.Segmenter('km', { granularity: 'word' });
        return Array.from(seg.segment(text)).filter(function(s) { return s.isWordLike !== false && dictIsKhmer(s.segment); }).map(function(s) { return s.segment; });
      } catch (e) { return []; }
    }

    // ── Recent searches ──
    function transHistLoad() { var h = safeJsonParse(ls(TRANS_HIST_KEY), []); return Array.isArray(h) ? h : []; }
    function transHistAdd(q, sl, tl) {
      var h = transHistLoad().filter(function(x) { return x.q !== q; });
      h.unshift({ q: q, dir: sl.toUpperCase() + ' ➔ ' + tl.toUpperCase() });
      lsSet(TRANS_HIST_KEY, JSON.stringify(h.slice(0, 10)));
      transRenderHistory();
    }
    function transRenderHistory() {
      var box = el('th-tray');
      if (!box) return;
      var h = transHistLoad();
      if (!h.length) { box.innerHTML = ''; box.style.display = 'none'; return; }
      box.style.display = '';
      box.innerHTML = h.map(function(x, i) {
        return '<button type="button" class="th-pill" data-act="hist" data-i="' + i + '"><span class="th-q' + (dictIsKhmer(x.q) ? ' kh' : '') + '">' + esc(x.q) + '</span><span class="th-dir">' + esc(x.dir) + '</span></button>';
      }).join('') + '<button type="button" class="th-clear" data-act="hist-clear" title="Clear history">✕</button>';
    }

    // ── Orchestration ──
    var TRANS_ENGINES = [
      { key: 'google', name: 'Google', fn: transGoogle },
      { key: 'mymemory', name: 'MyMemory', fn: transMyMemory },
      { key: 'lingva', name: 'Lingva', fn: transLingva },
      { key: 'wiktionary', name: 'Wiktionary', fn: function(t, sl) { return transWiktionary(t, sl); } }
    ];

    async function dictSearch(word) {
      word = (word || '').trim();
      if (!word) return;
      var myReq = ++dictState.reqId;
      var sl = dictIsKhmer(word) ? 'km' : 'en', tl = sl === 'km' ? 'en' : 'km';
      dictState.query = word; dictState.sourceLang = sl; dictState.targetLang = tl; dictState.drawerOpen = false;
      var di = el('dict-input'); if (di) di.value = word;
      var dc = el('dict-clear'); if (dc) dc.style.display = 'block';
      stopAllAudio();
      transHistAdd(word, sl, tl);
      var box = el('dict-content');
      if (box) box.innerHTML = transNumberBanner(word) + '<div class="sc-card sc-skel"><div class="skel" style="height:26px;width:55%;margin-bottom:10px"></div><div class="skel" style="height:12px;width:35%;margin-bottom:14px"></div><div class="skel" style="height:12px;width:90%;margin-bottom:6px"></div><div class="skel" style="height:12px;width:70%"></div></div>';

      var local = transLocalLookup(word, sl);
      var settled = await Promise.allSettled(TRANS_ENGINES.map(function(eng) {
        var t0 = performance.now();
        return eng.fn(word, sl, tl).then(function(r) {
          r.ms = Math.round(performance.now() - t0); return r;
        }, function(err) {
          var e = new Error(err && err.message || 'Failed'); e.ms = Math.round(performance.now() - t0); throw e;
        });
      }));
      if (myReq !== dictState.reqId) return; // a newer search started
      var results = {};
      settled.forEach(function(s, i) {
        var eng = TRANS_ENGINES[i];
        results[eng.key] = s.status === 'fulfilled' ? Object.assign({ name: eng.name, status: 'ok' }, s.value)
          : { name: eng.name, status: 'err', error: s.reason && s.reason.message || 'Failed', ms: s.reason && s.reason.ms };
      });
      results.local = local ? Object.assign({ name: 'Local Dict', status: 'ok', ms: 0 }, local) : { name: 'Local Dict', status: 'err', error: 'Not in your deck', ms: 0 };
      dictState.apiResults = results;
      dictState.consensus = transBuildConsensus(results, word, sl);
      transRenderCard();
    }

    function transBuildConsensus(R, query, sl) {
      var votes = {}, order = ['local', 'google', 'lingva', 'mymemory', 'wiktionary'];
      order.forEach(function(k) {
        var r = R[k];
        if (!r || r.status !== 'ok' || !r.translation) return;
        var n = dictNorm(r.translation);
        if (!n || n === dictNorm(query)) return;
        if (!votes[n]) votes[n] = { text: r.translation, count: 0, first: order.indexOf(k), sources: [] };
        votes[n].count++; votes[n].sources.push(r.name);
      });
      var list = Object.keys(votes).map(function(k) { return votes[k]; }).sort(function(a, b) { return b.count - a.count || a.first - b.first; });
      var remoteOk = ['google', 'mymemory', 'lingva', 'wiktionary'].filter(function(k) { return R[k].status === 'ok'; }).length;
      if (!list.length) return null;
      var top = list[0], pos = [], alts = [], defs = [], examples = [], roman = '', srcRoman = '';
      order.forEach(function(k) {
        var r = R[k]; if (!r || r.status !== 'ok') return;
        (r.pos || []).forEach(function(p) { p = p.charAt(0).toUpperCase() + p.slice(1); if (pos.indexOf(p) === -1) pos.push(p); });
        (r.alts || []).forEach(function(a) { if (dictNorm(a) !== dictNorm(top.text) && alts.map(dictNorm).indexOf(dictNorm(a)) === -1) alts.push(a); });
        list.slice(1).forEach(function(v) { if (alts.map(dictNorm).indexOf(dictNorm(v.text)) === -1) alts.push(v.text); });
        (r.defs || []).forEach(function(d) { defs.push({ pos: d.pos, text: d.text, from: r.name }); });
        (r.examples || []).forEach(function(x) { if (x.src && examples.length < 2) examples.push(x); });
        if (!roman && r.roman) roman = r.roman;
        if (!srcRoman && r.srcRoman) srcRoman = r.srcRoman;
      });
      if (R.local.status === 'ok' && R.local.roman) { if (sl === 'km') srcRoman = R.local.roman; else roman = R.local.roman; }
      var kh = sl === 'km' ? query : top.text, en = sl === 'km' ? top.text : query;
      var khRoman = (sl === 'km' ? srcRoman : roman) || transRomanize(kh);
      return {
        text: top.text, sources: top.sources, agree: top.count, remoteOk: remoteOk, offlineOnly: remoteOk === 0,
        kh: kh, en: en, khRoman: khRoman, pos: pos.slice(0, 4), alts: alts.slice(0, 10), defs: defs.slice(0, 6), examples: examples,
        register: transRegister(kh, defs.map(function(d) { return d.text; }).join(' ')),
        category: R.local.status === 'ok' && R.local.category ? R.local.category : transSuggestCat(en, pos)
      };
    }

    function transSuggestCat(en, pos) {
      var cats = getAllCats();
      if (String(en).trim().split(/\s+/).length > 3 && cats.indexOf('Sentences') !== -1) return 'Sentences';
      var p = (pos[0] || '').toLowerCase();
      var guess = cats.filter(function(c) { var l = c.toLowerCase(); return p && (l === p + 's' || l === p || l.indexOf(p) === 0); })[0];
      return guess || 'Words';
    }

    function transNumberBanner(text) {
      var n = transNumberInfo(text);
      if (!n) return '';
      return '<div class="tn-banner"><div class="tn-title">🔢 Number</div><div class="tn-grid">' +
        '<div class="tn-cell"><span class="tn-lbl">Arabic</span><span class="tn-val">' + esc(n.arabic) + '</span></div>' +
        '<div class="tn-cell"><span class="tn-lbl">Khmer</span><span class="tn-val kh">' + esc(n.khmer) + '</span></div>' +
        '<div class="tn-cell tn-wide"><span class="tn-lbl">Written</span><span class="tn-val kh">' + esc(n.words) + '</span>' +
        '<button type="button" class="sc-icon-btn" data-act="speak-kh" data-text="' + esc(n.words) + '" title="Hear it">🔊</button></div></div></div>';
    }

    function transRenderCard() {
      var box = el('dict-content'); if (!box) return;
      var c = dictState.consensus, R = dictState.apiResults, q = dictState.query;
      var html = transNumberBanner(q);
      var keys = ['google', 'mymemory', 'lingva', 'wiktionary', 'local'];
      var okCount = keys.filter(function(k) { return R[k] && R[k].status === 'ok'; }).length;
      if (!c) {
        html += '<div class="sc-card"><div class="sc-topline"><span class="sc-dir">' + dictState.sourceLang.toUpperCase() + ' ➔ ' + dictState.targetLang.toUpperCase() + '</span>' + transSrcBadge(okCount, keys.length) + '</div>' +
          '<div class="trans-no-results"><p>No translation found' + (okCount ? '' : ' — all sources are unreachable and the word isn’t in your deck') + '.</p></div>' + transDrawer() + '</div>';
        box.innerHTML = html; return;
      }
      var mainIsKh = dictIsKhmer(c.text);
      html += '<div class="sc-card">' +
        '<div class="sc-topline"><span class="sc-dir">' + dictState.sourceLang.toUpperCase() + ' ➔ ' + dictState.targetLang.toUpperCase() + ' · <span class="' + (dictIsKhmer(q) ? 'kh' : '') + '">' + esc(q) + '</span></span>' + transSrcBadge(okCount, keys.length) + '</div>';
      if (c.offlineOnly) html += '<div class="sc-offline">📴 Online sources unavailable — showing your offline match</div>';
      if (!mainIsKh) html += '<div class="sc-src-kh"><span class="kh">' + esc(c.kh) + '</span><div class="sc-ro">' + esc(c.khRoman) + '</div></div>';
      html += '<div class="sc-main"><div class="sc-trans' + (mainIsKh ? ' kh' : '') + '">' + esc(c.text) + '</div>' +
        '<div class="sc-acts"><button type="button" class="sc-icon-btn" data-act="speak-main" title="Listen">🔊</button>' +
        '<button type="button" class="sc-icon-btn" data-act="copy" title="Copy">📋</button></div></div>';
      if (mainIsKh) html += '<div class="sc-ro">' + esc(c.khRoman) + '</div>';
      var badges = c.pos.map(function(p) { return '<span class="sc-badge">' + esc(p) + '</span>'; }).join('');
      if (c.register) badges += '<span class="sc-badge sc-badge-reg">' + esc(c.register) + '</span>';
      if (R.local.status === 'ok' && R.local.inDeck) badges += '<span class="sc-badge sc-badge-deck">✓ In your deck</span>';
      if (badges) html += '<div class="sc-badges">' + badges + '</div>';
      var segs = transSegment(c.kh);
      if (segs.length > 1) {
        html += '<div class="sc-sec-title">Sentence Breakdown</div><div class="sc-segs">' + segs.map(function(s, i) {
          return '<span class="sc-seg"><button type="button" class="sc-seg-word kh" data-act="seg" data-i="' + i + '">' + esc(s) + '</button>' +
            '<button type="button" class="sc-seg-add" data-act="seg-add" data-i="' + i + '" title="Add this word">+</button></span>';
        }).join('') + '</div><div class="sc-seg-info" id="sc-seg-info"></div>';
        dictState.segments = segs;
      } else dictState.segments = [];
      if (c.alts.length) html += '<div class="sc-sec-title">Alternatives &amp; synonyms</div><div class="sc-tags">' + c.alts.map(function(a) {
        return '<button type="button" class="sc-tag' + (dictIsKhmer(a) ? ' kh' : '') + '" data-act="search" data-text="' + esc(a) + '">' + esc(a) + '</button>';
      }).join('') + '</div>';
      if (c.examples.length) {
        var ex = c.examples[0], top = ex.src, bottom = ex.tr;
        if (!dictIsKhmer(top) && dictIsKhmer(bottom)) { var t = top; top = bottom; bottom = t; }
        html += '<div class="sc-example"><div class="sc-ex-lbl">Example · ' + esc(ex.from) + '</div><div class="sc-ex-top' + (dictIsKhmer(top) ? ' kh' : '') + '">' + esc(top) + '</div>' + (bottom ? '<div class="sc-ex-bot">' + esc(bottom) + '</div>' : '') + '</div>';
      }
      if (c.defs.length) html += '<details class="sc-defs"><summary>Definitions (' + c.defs.length + ')</summary><ul>' + c.defs.map(function(d) {
        return '<li><span class="trans-def-pos">' + esc(d.pos || '') + '</span> ' + esc(d.text) + ' <span class="sc-def-from">' + esc(d.from) + '</span></li>';
      }).join('') + '</ul></details>';
      html += '<button type="button" class="sc-add-btn" data-act="add">＋ Add to Vocabulary</button>';
      html += transDrawer() + '</div>';
      box.innerHTML = html;
    }

    function transSrcBadge(ok, total) {
      return '<button type="button" class="sc-src-badge' + (dictState.drawerOpen ? ' open' : '') + '" data-act="drawer" title="API verification & sources">' + (ok ? '⚡ ' + ok + '/' + total + ' Sources' : 'ⓘ Sources') + '</button>';
    }

    function transDrawer() {
      var R = dictState.apiResults, c = dictState.consensus;
      var rows = ['google', 'mymemory', 'lingva', 'wiktionary', 'local'].map(function(k) {
        var r = R[k]; if (!r) return '';
        var agrees = c && r.status === 'ok' && r.translation && dictNorm(r.translation) === dictNorm(c.text);
        var body = r.status === 'ok'
          ? '<div class="sd-tr' + (dictIsKhmer(r.translation) ? ' kh' : '') + '">' + esc(r.translation || (r.defs && r.defs[0] ? r.defs[0].text : '—')) + '</div>'
          : '<div class="sd-err">' + esc(r.error) + '</div>';
        return '<div class="sd-row ' + (r.status === 'ok' ? 'ok' : 'err') + '"><div class="sd-head"><span class="sd-name">' + esc(r.name) + '</span>' +
          '<span class="sd-meta">' + (r.ms != null ? r.ms + ' ms' : '') + (r.confidence ? ' · ' + esc(r.confidence) : '') + (agrees ? ' · <span class="sd-agree">✓ consensus</span>' : '') + '</span></div>' + body + '</div>';
      }).join('');
      return '<div class="sc-drawer' + (dictState.drawerOpen ? ' open' : '') + '" id="sc-drawer">' + rows + '</div>';
    }

    function transCopy(text, btn) {
      var done = function() { if (!btn) return; var o = btn.textContent; btn.textContent = '✓'; btn.classList.add('ok'); setTimeout(function() { btn.textContent = o; btn.classList.remove('ok'); }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function() { fallback(); });
      else fallback();
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed', 'err'); }
        ta.remove();
      }
    }

    function transSpeak(text) {
      if (dictIsKhmer(text)) speakKhmer(text); else speakEnglish(text);
    }

    // one delegated handler for the whole translate page
    (function() {
      var page = el('page-trans');
      if (!page) return;
      page.addEventListener('click', function(e) {
        var b = e.target.closest('[data-act]');
        if (!b || !page.contains(b)) return;
        var act = b.getAttribute('data-act'), c = dictState.consensus;
        if (act === 'hist') { var h = transHistLoad()[+b.getAttribute('data-i')]; if (h) dictSearch(h.q); }
        else if (act === 'hist-clear') { lsSet(TRANS_HIST_KEY, '[]'); transRenderHistory(); }
        else if (act === 'speak-main' && c) transSpeak(c.text);
        else if (act === 'speak-kh') speakKhmer(b.getAttribute('data-text'));
        else if (act === 'copy' && c) transCopy(c.text, b);
        else if (act === 'search') dictSearch(b.getAttribute('data-text'));
        else if (act === 'drawer') {
          dictState.drawerOpen = !dictState.drawerOpen;
          var d = el('sc-drawer'); if (d) d.classList.toggle('open', dictState.drawerOpen);
          b.classList.toggle('open', dictState.drawerOpen);
        } else if (act === 'add' && c) addFromTranslation(c.en, c.kh, c.khRoman, c.category);
        else if (act === 'seg' || act === 'seg-add') {
          var w = (dictState.segments || [])[+b.getAttribute('data-i')]; if (!w) return;
          var info = transSegmentInfo(w);
          if (act === 'seg-add') { addFromTranslation(info.en, w, info.ro, 'Words'); return; }
          speakKhmer(w);
          page.querySelectorAll('.sc-seg-word.on').forEach(function(x) { x.classList.remove('on'); });
          b.classList.add('on');
          var box = el('sc-seg-info');
          if (box) box.innerHTML = '<span class="kh">' + esc(w) + '</span> <span class="sc-ro-inline">' + esc(info.ro) + '</span> — ' +
            (info.en ? esc(info.en) + (info.inDeck ? ' <span class="sc-badge sc-badge-deck">deck</span>' : '') : '<span class="sd-err">not in your deck</span> <button type="button" class="sc-tag kh" data-act="search" data-text="' + esc(w) + '">🔍 look up</button>');
        }
      });
    })();
    transRenderHistory();

    function openImportModal() {
      el('csv-file-name').textContent = '';
      el('csv-preview').style.display = 'none';
      el('csv-err').style.display = 'none';
      el('csv-file-input').value = '';
      el('csv-import-btn').disabled = true;
      el('csv-import-btn').style.opacity = '.5';
      el('csv-loading').classList.remove('active');
      el('csv-main-area').style.display = '';
      el('csv-import-lbl').textContent = 'Import';
      csvParsed = [];
      el('import-ovl').classList.add('open');
    }

    function closeImportModal() {
      el('import-ovl').classList.remove('open');
      if (MAIN_USER && !SCRIPT_URL) onboardComplete(true);
    }

    function handleCsvFile(event) {
      var file = event.target.files[0];
      if (!file) return;
      el('csv-file-name').textContent = file.name;
      el('csv-err').style.display = 'none';
      el('csv-preview').style.display = 'none';
      el('csv-import-btn').disabled = true;
      el('csv-import-btn').style.opacity = '.5';
      csvParsed = [];
      el('csv-loading').classList.add('active');
      el('csv-loading-txt').textContent = 'Reading file…';
      el('csv-main-area').style.display = 'none';
      var reader = new FileReader();
      reader.onload = function(e) {
        setTimeout(function() {
          el('csv-loading-txt').textContent = 'Parsing rows…';
          setTimeout(function() {
            try {
              var rows = parseCSV(e.target.result);
              el('csv-loading').classList.remove('active');
              el('csv-main-area').style.display = '';
              if (!rows.length) {
                showCsvErr('File is empty or unreadable.');
                return;
              }
              // Normalise headers: strip BOM/quotes/whitespace, case-insensitive, ignore _ - and spaces
              var _norm = function(h) { return String(h || '').replace(/^\uFEFF/, '').trim().replace(/^"|"$/g, '').toLowerCase().replace(/[\s_\-]+/g, ' ').trim(); };
              var header = rows[0].map(_norm);

              function fc() {
                for (var a = 0; a < arguments.length; a++) {
                  var i = header.indexOf(_norm(arguments[a]));
                  if (i !== -1) return i;
                }
                return -1;
              }
              var enIdx = fc('english', 'en', 'meaning', 'translation'),
                khIdx = fc('khmer', 'kh', 'word');
              if (enIdx === -1 && khIdx === -1) {
                showCsvErr('Missing "English" or "Khmer" header.');
                return;
              }
              var roIdx = fc('romanization', 'pronunciation', 'phonetic', 'romanisation');
              var noIdx = fc('notes', 'note'),
                caIdx = fc('category', 'topic', 'categories', 'tag'),
                posIdx = fc('pos', 'type', 'part of speech'),
                dtIdx = fc('date added', 'date', 'dateadded');
              var _cell = function(row, i) { return i >= 0 ? String(row[i] == null ? '' : row[i]).replace(/\s+/g, ' ').trim() : ''; };
              // Existing-word lookup as a Set (O(1) per row — fast for 5,000+ word lists)
              var _exEn = new Set(), _exKh = new Set();
              allRows.forEach(function(r) {
                var e1 = (r.english || '').trim().toLowerCase(), k1 = (r.khmer || '').trim();
                if (e1) _exEn.add(e1);
                if (k1) _exKh.add(k1);
              });
              var _p = function(x) {
                return x < 10 ? '0' + x : String(x);
              };

              var _catLookup = {};
              getAllCats().forEach(function(c) { _catLookup[c.toLowerCase()] = c; });
              var _matchCat = function(c) { if (!c) return ''; return _catLookup[c.toLowerCase()] || c; };
              var _khNow = new Date(Date.now() + 7 * 3600000);
              csvParsed = [];
              var skipped = 0,
                today = _khNow.getUTCFullYear() + '-' + _p(_khNow.getUTCMonth() + 1) + '-' + _p(_khNow.getUTCDate()) + ' ' + _p(_khNow.getUTCHours()) + ':' + _p(_khNow.getUTCMinutes());
              rows.slice(1).forEach(function(row) {
                var en = _cell(row, enIdx),
                  kh = _cell(row, khIdx);
                if (!en && !kh) {
                  skipped++;
                  return;
                }
                var isDup = (en && _exEn.has(en.toLowerCase())) || (kh && _exKh.has(kh));
                if (isDup) {
                  skipped++;
                  return;
                }
                csvParsed.push({
                  english: en,
                  khmer: kh,
                  romanization: _cell(row, roIdx),
                  notes: noIdx >= 0 ? String(row[noIdx] == null ? '' : row[noIdx]).trim() : '',
                  category: _matchCat(_cell(row, caIdx)) || 'Words',
                  pos: _cell(row, posIdx),
                  dateAdded: _cell(row, dtIdx) || today
                });
              });
              if (!csvParsed.length) {
                showCsvErr('No valid new rows found.' + (skipped ? ' ' + skipped + ' skipped.' : ''));
                return;
              }
              var prev = el('csv-preview');
              prev.style.display = 'block';
              el('csv-preview-title').textContent = 'Ready to import ' + csvParsed.length + ' entries' + (skipped ? ' (' + skipped + ' skipped)' : '');
              var list = el('csv-preview-list');
              list.innerHTML = '';
              csvParsed.slice(0, 6).forEach(function(r) {
                var d = document.createElement('div');
                d.style.cssText = 'font-size:.73rem;padding:4px 0;border-bottom:1px solid var(--bdr)';
                d.innerHTML = '<span class="kh" style="color:var(--acc3)">' + esc(r.khmer || '—') + '</span> — ' + esc(r.english || '—') + ' <span style="color:var(--dim);font-size:.65rem">[' + esc(r.category) + ']</span>';
                list.appendChild(d);
              });
              if (csvParsed.length > 6) {
                var more = document.createElement('div');
                more.style.cssText = 'font-size:.7rem;color:var(--dim);margin-top:4px';
                more.textContent = '…and ' + (csvParsed.length - 6) + ' more';
                list.appendChild(more);
              }
              el('csv-import-btn').disabled = false;
              el('csv-import-btn').style.opacity = '1';
            } catch (err) {
              el('csv-loading').classList.remove('active');
              el('csv-main-area').style.display = '';
              showCsvErr('Could not read file: ' + err.message);
            }
          }, 400);
        }, 200);
      };
      reader.readAsText(file, 'UTF-8');
    }

    function showCsvErr(msg) {
      var e = el('csv-err');
      if (e) {
        e.textContent = '⚠️ ' + msg;
        e.style.display = 'block';
      }
      el('csv-import-btn').disabled = true;
      el('csv-import-btn').style.opacity = '.5';
    }

    function parseCSV(text) {
      var rows = [],
        row = [],
        cur = '',
        inQ = false;
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (inQ) {
          if (c === '"' && text[i + 1] === '"') {
            cur += '"';
            i++;
          } else if (c === '"') inQ = false;
          else cur += c;
        } else if (c === '"') inQ = true;
        else if (c === ',') {
          row.push(cur);
          cur = '';
        } else if (c === '\n') {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = '';
        } else cur += c;
      }
      if (cur || row.length) {
        row.push(cur);
        rows.push(row);
      }
      return rows.filter(function(r) {
        return r.some(function(c) {
          return (c || '').trim();
        });
      });
    }

    // Any category in the import that the user doesn't have yet is registered
    // locally AND on the sheet (manageCategory) so it isn't lost or shown as "Words".
    function registerImportedCats(words) {
      var known = {};
      getAllCats().forEach(function(c) { known[c.toLowerCase()] = 1; });
      var added = [];
      (words || []).forEach(function(w) {
        getWordCategories(w).forEach(function(c) {
          c = (c || '').trim();
          if (!c || c === 'Uncategorized' || known[c.toLowerCase()]) return;
          known[c.toLowerCase()] = 1;
          added.push(c);
        });
      });
      if (!added.length) return;
      added.forEach(function(c) {
        customCats.push(c);
        var di = deletedCats.indexOf(c);
        if (di !== -1) deletedCats.splice(di, 1);
      });
      saveCustomCats();
      try { lsSet(DELETED_CATS_KEY, JSON.stringify(deletedCats)); } catch (e) {}
      try { refreshAllCatDropdowns(); renderCustomCatList(); } catch (e) {}
      // sequential so the sheet's category list never races itself
      added.reduce(function(p, c) { return p.then(function() { return syncCategoryToSheet('add', c); }); }, Promise.resolve());
      toast('🏷 ' + added.length + ' new categor' + (added.length !== 1 ? 'ies' : 'y') + ' added: ' + added.slice(0, 3).join(', ') + (added.length > 3 ? '…' : ''), 'ok');
    }

    var _importSubmitting = false;
    function confirmImport() {
      if (_importSubmitting || importState.active) {
        toast('An import is already running — please wait.', 'inf');
        return;
      }
      if (!csvParsed.length) return;
      _importSubmitting = true;
      var _cib = el('csv-import-btn');
      if (_cib) { _cib.disabled = true; _cib.style.opacity = '.5'; }
      setTimeout(function() { _importSubmitting = false; }, 1500);
      // Drop rows already on the sheet, already queued, or repeated inside the file
      var _seenImp = {};
      var _impKey = function(w) { return (w.khmer || '').trim() + '|' + (w.english || '').trim().toLowerCase(); };
      allRows.concat(pendingQueue).forEach(function(r) { _seenImp[_impKey(r)] = 1; });
      var words = csvParsed.filter(function(w) {
        var k = _impKey(w);
        if (k === '|' || _seenImp[k]) return false;
        _seenImp[k] = 1;
        return true;
      });
      var _skippedDup = csvParsed.length - words.length;
      csvParsed = [];
      if (_skippedDup) toast(_skippedDup + ' duplicate' + (_skippedDup !== 1 ? 's' : '') + ' skipped.', 'inf');
      if (!words.length) { el('import-ovl').classList.remove('open'); return; }
      el('import-ovl').classList.remove('open');
      registerImportedCats(words);
      toast('Importing ' + words.length + ' words…', 'inf');
      words.forEach(function(w) {
        allRows.unshift(Object.assign({}, w, {
          rowIndex: 0
        }));
      });
      saveCache(allRows);
      render();
      renderFav();
      renderProgress();
      if (words.length > 0) {
        checkAndUnlock('first_contact');
        checkAndUnlock('actually_smart');
      }
      if (!SCRIPT_URL || !MAIN_USER) {
        toast('Saved locally (' + words.length + ' words). Connect sheet to sync.', 'inf');
        return;
      }
      var CHUNK = 5,
        chunks = [];
      for (var i = 0; i < words.length; i += CHUNK) chunks.push(words.slice(i, i + CHUNK));
      _etaReset('imp');
      importState = {
        active: true,
        total: words.length,
        sent: 0,
        failed: 0,
        label: 'Sending batch 1/' + chunks.length + '…'
      };
      setBusy(1);
      updateImportProgress();

      function sendChunk(ci) {
        if (ci >= chunks.length) {
          importState.active = false;
          setBusy(-1);
          toast(importState.failed === 0 ? '✓ ' + importState.sent + ' words imported!' : importState.sent + ' imported, ' + importState.failed + ' failed.', importState.failed === 0 ? 'ok' : 'err');
          setStatus('ok', allRows.length + ' words');
          loadData();
          return;
        }
        var chunk = chunks[ci];
        importState.label = 'Sending batch ' + (ci + 1) + '/' + chunks.length + '…';
        updateImportProgress();
        var url = new URL(SCRIPT_URL);
        url.searchParams.set('action', 'importWords');
        url.searchParams.set('user', MAIN_USER);
        url.searchParams.set('tab', MAIN_USER);
        url.searchParams.set('words', JSON.stringify(chunk));
        fetch(url.toString()).then(function(r) {
          return r.json();
        }).then(function(j) {
          if (j.success) importState.sent += (j.imported || chunk.length);
          else importState.failed += chunk.length;
          updateImportProgress();
          setTimeout(function() {
            sendChunk(ci + 1);
          }, 600);
        }).catch(function() {
          importState.failed += chunk.length;
          updateImportProgress();
          setTimeout(function() {
            sendChunk(ci + 1);
          }, 600);
        });
      }
      sendChunk(0);
    }
    async function exportCSV() {
      if (!allRows.length) {
        toast('No data to export.', 'err');
        return;
      }
      var lines = [
        ['English', 'Khmer', 'Romanization', 'Notes', 'Category', 'Date Added'].join(',')
      ];
      allRows.forEach(function(r) {
        var cols = [r.english, r.khmer, r.romanization, r.notes, r.category, r.dateAdded];
        lines.push(cols.map(function(c) {
          var s = String(c || '').replace(/"/g, '""');
          return (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) ? '"' + s + '"' : s;
        }).join(','));
      });
      var csv = lines.join('\n'),
        filename = 'khmer-vocab-' + new Date().toISOString().slice(0, 10) + '.csv';
      if ('showSaveFilePicker' in window) {
        try {
          var handle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: 'CSV',
              accept: {
                'text/csv': ['.csv']
              }
            }]
          });
          var w = await handle.createWritable();
          await w.write(csv);
          await w.close();
          toast('CSV saved! ✓', 'ok');
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }
      blobDownload(csv, filename);
    }

    async function blobDownload(content, filename) {
      var res = await saveFileWithPicker(content, filename, 'text/csv;charset=utf-8', 'CSV Spreadsheet');
      if (res !== 'cancelled') toast(res === 'saved' ? 'CSV saved. ✓' : 'CSV downloaded. ✓', 'ok');
    }

    function openConfStudy(confLevel) {

      var labels = {
        '2': 'Got It',
        '1': 'Kinda',
        '0': 'Unknown',
        '-1': 'Unstudied'
      };
      var pool = allRows.filter(function(r) {
        var c = confidence[wordKey(r)];
        if (confLevel === -1) return c === undefined;
        return c === confLevel;
      });
      var label = labels[String(confLevel)] || 'Words';
      var ovl = el('conf-words-ovl');
      var titleEl = el('conf-words-title');
      var listEl = el('conf-words-list');
      if (!ovl || !listEl) return;
      if (titleEl) titleEl.textContent = label + ' — ' + pool.length + ' word' + (pool.length !== 1 ? 's' : '');
      listEl.innerHTML = '';
      if (!pool.length) {
        listEl.innerHTML = '<div style="font-size:.8rem;color:var(--dim);padding:12px 0">No words in this category yet.</div>';
      } else {
        pool.forEach(function(r) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bdr);gap:12px';
          row.innerHTML = '<span style="font-size:.85rem;color:var(--text)">' + esc(r.english || '—') + '</span>' +
            '<span class="kh" style="font-size:1rem;color:var(--acc3)">' + esc(r.khmer || '—') + '</span>';
          listEl.appendChild(row);
        });
      }
      _confStudyLevel = confLevel;
      _confStudyPool = pool;
      ovl.classList.add('open');
    }

    function _studyConfWords() {
      var ovl = el('conf-words-ovl');
      if (!ovl) return;
      var confLevel = _confStudyLevel;
      var pool = _confStudyPool || [];
      ovl.classList.remove('open');
      if (!pool.length) {
        toast('No words to study.', 'inf');
        return;
      }
      var map = {
        '2': 'got',
        '1': 'kinda',
        '0': 'unknown',
        '-1': 'unstudied'
      };
      var filterVal = map[String(confLevel)] || 'all';
      goPage('study', 'nav-study');
      var userSel = el('study-filter'),
        presetSel = el('study-preset-filter'),
        cf = el('study-conf-filter');
      if (userSel) userSel.value = 'All';
      if (presetSel) presetSel.value = 'none';
      if (cf) cf.value = filterVal;
      initStudyPage();
    }

    function resetConfidence() {
      if (!confirm('Reset all confidence and SRS ratings?')) return;
      confidence = {};
      srsData = {};
      lsSet(CONF_KEY, '{}');
      lsSet(SRS_KEY, '{}');
      toast('Reset.', 'ok');
      renderProgress();
    }

    function _srchClear(inpId, btnId) {
      var inp = el(inpId);
      var btn = el(btnId);
      if (btn) btn.style.display = (inp && inp.value.length > 0) ? 'block' : 'none';
    }

    function toast(msg, type) {
      var box = el('tbox');
      if (!box) return;
      var div = document.createElement('div');
      div.className = 'toast ' + (type || 'inf');
      div.textContent = msg;
      box.appendChild(div);
      setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 3500);
    }


    var writeDeck = [],
      writeIdx = 0,
      writeChecked = false;
    var listenDeck = [],
      listenIdx = 0,
      listenChecked = false;

    function startWriting() {
      var src = (studyDeck && studyDeck.length > 0) ? studyDeck : allRows;
      writeDeck = src.filter(function(r) {
          return !!r.english && !!r.khmer;
        })
        .slice().sort(function() {
          return Math.random() - 0.5;
        });
      writeIdx = 0;

      var _wsb = el('write-speak-btn');
      if (_wsb) _wsb.style.display = writeDeck.length > 0 ? 'block' : 'none';
      showWriteCard();
    }

    function speakWriteCard() {

      var r = writeDeck[writeIdx];
      if (r && r.khmer) speakKhmer(r.khmer);
    }

    function showWriteCard() {
      writeChecked = false;
      var btn = el('write-check-btn');
      if (btn) btn.textContent = '\u2713 Check';
      var r = writeDeck[writeIdx];
      var prompt = el('write-prompt');
      var prog = el('write-progress');
      var inp = el('write-input');
      var res = el('write-result');
      if (!prompt) return;
      if (!r) {
        prompt.innerHTML = '\u2705 Done! Tap \uD83D\uDD00 to shuffle again.';
        if (prog) prog.textContent = '';
        if (res) res.style.display = 'none';
        var _wsb2 = el('write-speak-btn');
        if (_wsb2) _wsb2.style.display = 'none';
        return;
      }
      prompt.innerHTML = '<span style="font-size:.68rem;color:var(--dim);display:block;margin-bottom:6px">Type the Khmer:</span>' +
        '<strong style="font-size:1.05rem">' + esc(r.english || '?') + '</strong>';
      if (prog) prog.textContent = (writeIdx + 1) + ' / ' + writeDeck.length;
      if (inp) {
        inp.value = '';
        inp.placeholder = 'Type Khmer\u2026';
      }
      if (res) res.style.display = 'none';
    }

    function checkWriting() {
      var r = writeDeck[writeIdx];
      if (!r) {
        startWriting();
        return;
      }
      var btn = el('write-check-btn');
      if (writeChecked) {
        writeChecked = false;
        writeIdx++;
        showWriteCard();
        return;
      }
      var inp = el('write-input');
      var res = el('write-result');
      if (!inp || !res) return;
      var ans = inp.value.trim();
      var correctRaw = (r.khmer || '').trim();
      res.style.display = 'block';
      if (!correctRaw) {
        res.className = 'write-result wrong';
        res.textContent = '\u2139 No Khmer saved for this word.';
      } else {
        var m = answerMatch(ans, correctRaw);
        if (m === 'exact') {
          res.className = 'write-result correct';
          res.textContent = '\u2713 Correct! ' + correctRaw;
        } else if (m === 'accent') {
          res.className = 'write-result correct';
          res.textContent = '\u2713 Correct \u2014 mind the accents: ' + correctRaw;
        } else {
          res.className = 'write-result wrong';
          res.textContent = '\u2717 Answer: ' + correctRaw;
        }
      }
      writeChecked = true;
      if (btn) btn.textContent = 'Next Word \u2192';
    }

    function normAnswer(v) {
      return (v || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function stripAccents(v) {
      try {
        return (v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      } catch (e) {
        return v || '';
      }
    }

    function answerMatch(ans, correct) {
      var a = normAnswer(ans);
      if (!a) return 'no';
      var clean = function(s) {
        return (s || '')
          .toLowerCase()
          .replace(/[?!.,;:"'()\[\]]/g, '')
          .replace(/^(o|a|os|as|um|uma|to)\s+/i, '')
          .replace(/\s+/g, ' ')
          .trim();
      };
      var aClean = clean(a);
      var parts = (correct || '').split(/[\/,;]|\sor\s/i).map(function(p) { return p.trim(); });
      parts.push((correct || '').trim());
      for (var i = 0; i < parts.length; i++) {
        var cPart = parts[i];
        if (!cPart) continue;
        var cNorm = normAnswer(cPart);
        if (a === cNorm) return 'exact';
        if (stripAccents(a) === stripAccents(cNorm)) return 'accent';
        var cClean = clean(cPart);
        if (aClean && aClean === cClean) return 'exact';
        if (aClean && stripAccents(aClean) === stripAccents(cClean)) return 'accent';
      }
      return 'no';
    }

    function prevWriting() {
      writeChecked = false;
      var btn = el('write-check-btn');
      if (btn) btn.textContent = '\u2713 Check';
      if (writeDeck.length === 0) return;
      writeIdx = (writeIdx - 1 + writeDeck.length) % writeDeck.length;
      showWriteCard();
    }


    function startListening() {
      var src = (studyDeck && studyDeck.length > 0) ? studyDeck : allRows;
      listenDeck = src.filter(function(r) {
          return !!r.khmer;
        })
        .slice().sort(function() {
          return Math.random() - 0.5;
        });
      listenIdx = 0;
      showListenCard();
      var pb = el('listen-play-btn');
      if (pb) pb.style.display = 'block';
    }

    function showListenCard() {
      listenChecked = false;
      var cbtn = el('listen-check-btn');
      if (cbtn) cbtn.textContent = '\u2713 Check';
      var r = listenDeck[listenIdx];
      var prompt = el('listen-prompt');
      var prog = el('listen-progress');
      var inp = el('listen-input');
      var res = el('listen-result');
      if (!prompt) return;
      if (!r) {
        prompt.innerHTML = '\u2705 Done! Tap \uD83D\uDD00 to shuffle again.';
        if (prog) prog.textContent = '';
        if (res) res.style.display = 'none';
        var pb = el('listen-play-btn');
        if (pb) pb.style.display = 'none';
        return;
      }
      prompt.innerHTML = '<span style="font-size:.68rem;color:var(--dim);display:block;margin-bottom:6px">Tap \u201cHear\u201d then spell the Khmer word:</span>' +
        '<span style="opacity:.45;font-size:.9rem">\uD83D\uDD0A tap below to hear\u2026</span>';
      if (prog) prog.textContent = (listenIdx + 1) + ' / ' + listenDeck.length;
      if (inp) {
        inp.value = '';
        inp.placeholder = 'Type Khmer\u2026';
      }
      if (res) res.style.display = 'none';
    }

    function playCurrentListenCard() {
      var r = listenDeck[listenIdx];
      if (!r || !r.khmer) return;
      speakKhmer(r.khmer);
      var prompt = el('listen-prompt');
      if (prompt) {
        prompt.innerHTML = '<span style="font-size:.68rem;color:var(--dim);display:block;margin-bottom:6px">Spell the Khmer word you heard:</span>' +
          '<span style="opacity:.55;font-size:.85rem">\uD83D\uDD0A playing\u2026 type what you hear</span>';
      }
      var inp = el('listen-input');
      if (inp) setTimeout(function() {
        try {
          inp.focus();
        } catch (e) {}
      }, 80);
    }

    function checkListening() {
      var r = listenDeck[listenIdx];
      if (!r) {
        startListening();
        return;
      }
      var cbtn = el('listen-check-btn');
      if (listenChecked) {
        listenChecked = false;
        listenIdx++;
        showListenCard();
        return;
      }
      var inp = el('listen-input');
      var res = el('listen-result');
      if (!inp || !res) return;
      var ans = inp.value.trim();
      var correctRaw = (r.khmer || '').trim();
      res.style.display = 'block';
      if (!correctRaw) {
        res.className = 'write-result wrong';
        res.textContent = '\u2139 No Khmer saved for this word.';
      } else {
        var m2 = answerMatch(ans, correctRaw);
        if (m2 === 'exact') {
          res.className = 'write-result correct';
          res.textContent = '\u2713 Correct! ' + correctRaw;
        } else if (m2 === 'accent') {
          res.className = 'write-result correct';
          res.textContent = '\u2713 Correct \u2014 mind the accents: ' + correctRaw;
        } else {
          res.className = 'write-result wrong';
          res.textContent = '\u2717 Answer: ' + correctRaw;
        }
      }
      listenChecked = true;
      if (cbtn) cbtn.textContent = 'Next Word \u2192';
    }

    function prevListening() {
      listenChecked = false;
      var cbtn = el('listen-check-btn');
      if (cbtn) cbtn.textContent = '\u2713 Check';
      if (listenDeck.length === 0) return;
      listenIdx = (listenIdx - 1 + listenDeck.length) % listenDeck.length;
      showListenCard();
    }

    function enterFsFromOverlay() {
      var ov = el('fs-overlay');
      if (ov) ov.style.display = 'none';
      var de = document.documentElement;
      var req = de.requestFullscreen || de.webkitRequestFullscreen;
      if (req) req.call(de).catch(function() {
        toast('Full screen not supported here.', 'inf');
      });
    }

    function toggleFullscreen() {
      var de = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        var req = de.requestFullscreen || de.webkitRequestFullscreen;
        if (req) req.call(de).catch(function() {
          toast('Full screen not supported here.', 'inf');
        });
      } else {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) exit.call(document).catch(function() {});
      }
    }

    function _updateFsBtn() {
      var btn = el('fullscreen-btn');
      if (btn) btn.textContent = (document.fullscreenElement || document.webkitFullscreenElement) ? '\u2715 Exit Full Screen' : '\u26F6 Full Screen';
      _updateCardFsBtn();
    }
    document.addEventListener('fullscreenchange', _updateFsBtn);
    document.addEventListener('webkitfullscreenchange', _updateFsBtn);

    function _onReady() {
      applyTheme(ls(THEME_KEY) || 'dark');

      if (ls(MAINUSER_KEY) && !ls('kv_verified')) {
        MAIN_USER = ls(MAINUSER_KEY) || '';
        CURRENT_USER = MAIN_USER;
        applyUserBadge();
        updateCfgUsername();

        try {
          var ui = el('user-inp'),
            up = el('user-pass'),
            msgEl = el('user-login-msg');
          if (ui) ui.value = MAIN_USER;
          if (up) up.value = '';
          if (msgEl) {
            msgEl.style.display = 'block';
            msgEl.textContent = 'Legacy account detected — please enter a password to secure your account.';
            msgEl.style.background = 'rgba(255,243,205,.95)';
            msgEl.style.color = 'var(--dim)';
            msgEl.style.border = '1px solid rgba(255,200,0,.2)';
          }

          var ov = el('user-ovl');
          if (ov) ov.classList.add('open');

          setTimeout(function() {
            if (up) up.focus();
          }, 120);
        } catch (e) {}
      };
      init();
      if (S.autoFullscreen) {
        var ov = el('fs-overlay');
        if (ov) ov.style.display = 'flex';
      }
      applyTabOrder();
      applyHiddenTabs();
      loadColWidths();
    }


    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _onReady);
    } else {
      _onReady();
    }

    (()=>{const NAME="Khmer Vocabulary"+(typeof APP_VERSION!=="undefined"?" "+APP_VERSION:""),VERSION="v4",KEY="Ion-o-koji's Watermark "+VERSION,TITLES_KEY="Ion-o-koji's Watermark Titles "+VERSION;function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}function now(){return new Date().toISOString()}function fmt(iso){try{return new Date(iso).toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})}catch(e){return iso}}function getLoadTime(){try{const n=performance.getEntriesByType("navigation")[0];if(n&&n.loadEventEnd>0)return Math.round(n.loadEventEnd);const t=performance.timing;if(t&&t.loadEventEnd>0)return t.loadEventEnd-t.navigationStart}catch(e){}return null}function entryName(b){const m=b.match(/^> (.+)/);return m?m[1].trim():null}function buildEntry(first,last,count,lt,avg){let s="> "+NAME+"\n  - First opened: "+first+"\n  - Last opened: "+last+"\n  - Opened: "+count+" times";if(lt!=null)s+="\n  - Load time: "+lt+"ms";if(avg!=null)s+="\n  - Avg load time: "+avg+"ms";return s}function parseEntries(raw){if(!raw)return[];const res=[];let cur=[];for(const line of raw.split("\n")){if(/^> /.test(line)&&cur.length>0){const b=cur.join("\n").trimEnd();if(b)res.push(b);cur=[];}cur.push(line);}if(cur.length>0){const b=cur.join("\n").trimEnd();if(b&&/^> /.test(b))res.push(b);}return res}function parseEntry(b){if(!b)return null;const lines=b.split("\n"),get=f=>{const l=lines.find(l=>l.trim().startsWith("- "+f+": "));return l?l.trim().slice(f.length+3).trim():null},first=get("First opened"),opened=get("Opened");if(!first||!opened)return null;const count=parseInt(opened,10),avgStr=get("Avg load time");return{first,count:isNaN(count)?0:count,avgLoad:avgStr?parseInt(avgStr,10):null}}function updateTitles(){try{const raw=ls(TITLES_KEY)||"",others=raw.split("\n").map(l=>l.trim().replace(/^> /,"")).filter(l=>l&&l!==NAME);ls(TITLES_KEY,["> "+NAME,...others.map(l=>"> "+l)].join("\n"));}catch(e){}}try{const nowFmt=fmt(now()),lt=getLoadTime(),entries=parseEntries(ls(KEY)),existingIdx=entries.findIndex(b=>entryName(b)===NAME),existing=parseEntry(existingIdx>=0?entries[existingIdx]:null),others=entries.filter((_,i)=>i!==existingIdx),oldCount=existing?.count??0,newCount=oldCount+1,prevAvg=existing?.avgLoad??null;let newAvg=null;if(lt!=null)newAvg=(prevAvg!=null&&oldCount>0)?Math.round((prevAvg*oldCount+lt)/newCount):lt;else newAvg=prevAvg;const first=existing?.first??nowFmt;ls(KEY,[buildEntry(first,nowFmt,newCount,lt,newAvg),...others].join("\n\n"));updateTitles();}catch(e){}})();

  