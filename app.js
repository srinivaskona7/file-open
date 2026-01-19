/**
 * OpenFile Pro - Premium File Viewer Application
 * A modern, feature-rich file viewer with premium functionality
 */

// =====================================================
// Application State
// =====================================================
const AppState = {
  files: new Map(), // Map of fileId -> fileData
  activeTabId: "welcome",
  settings: {
    theme: "dark",
    fontSize: 14,
    fontFamily: "'Fira Code', monospace",
    lineNumbers: true,
    wordWrap: false,
    minimap: true,
    tabSize: 4,
  },
  search: {
    query: "",
    caseSensitive: false,
    regex: false,
    wholeWord: false,
    matches: [],
    currentIndex: 0,
  },
  zoom: 100,
  splitViewActive: false,
};

// =====================================================
// DOM Elements
// =====================================================
const DOM = {
  // Main containers
  app: document.querySelector(".app-container"),
  editorContainer: document.getElementById("editor-container"),
  welcomePanel: document.getElementById("welcome-panel"),
  viewerPanels: document.getElementById("viewer-panels"),

  // Drop zone
  dropZone: document.getElementById("drop-zone"),
  fileInput: document.getElementById("file-input"),
  browseBtn: document.getElementById("browse-btn"),

  // Tabs
  tabsContainer: document.getElementById("tabs-container"),
  newTabBtn: document.getElementById("new-tab-btn"),

  // Sidebar
  sidebar: document.getElementById("sidebar"),
  fileList: document.getElementById("file-list"),
  clearAllBtn: document.getElementById("clear-all-btn"),

  // Header controls
  globalSearch: document.getElementById("global-search"),
  themeToggle: document.getElementById("theme-toggle"),
  themeIconDark: document.getElementById("theme-icon-dark"),
  themeIconLight: document.getElementById("theme-icon-light"),
  settingsBtn: document.getElementById("settings-btn"),
  splitViewBtn: document.getElementById("split-view-btn"),
  diffViewBtn: document.getElementById("diff-view-btn"),

  // Toolbar buttons
  copyBtn: document.getElementById("copy-btn"),
  copyWithLinesBtn: document.getElementById("copy-with-lines-btn"),
  selectAllBtn: document.getElementById("select-all-btn"),
  findReplaceBtn: document.getElementById("find-replace-btn"),
  goToLineBtn: document.getElementById("go-to-line-btn"),
  wordWrapBtn: document.getElementById("word-wrap-btn"),
  lineNumbersBtn: document.getElementById("line-numbers-btn"),
  minimapBtn: document.getElementById("minimap-btn"),
  downloadBtn: document.getElementById("download-btn"),
  printBtn: document.getElementById("print-btn"),

  // Status bar
  fileTypeStatus: document.getElementById("file-type-status"),
  encodingStatus: document.getElementById("encoding-status"),
  cursorStatus: document.getElementById("cursor-status"),
  fileSizeStatus: document.getElementById("file-size-status"),
  linesStatus: document.getElementById("lines-status"),
  zoomLevel: document.getElementById("zoom-level"),
  zoomIn: document.getElementById("zoom-in"),
  zoomOut: document.getElementById("zoom-out"),

  // Modals
  findReplaceModal: document.getElementById("find-replace-modal"),
  gotoLineModal: document.getElementById("goto-line-modal"),
  settingsModal: document.getElementById("settings-modal"),
  diffModal: document.getElementById("diff-modal"),

  // Find & Replace
  findInput: document.getElementById("find-input"),
  replaceInput: document.getElementById("replace-input"),
  caseSensitiveBtn: document.getElementById("case-sensitive-btn"),
  regexBtn: document.getElementById("regex-btn"),
  wholeWordBtn: document.getElementById("whole-word-btn"),
  findResults: document.getElementById("find-results"),
  findPrevBtn: document.getElementById("find-prev-btn"),
  findNextBtn: document.getElementById("find-next-btn"),
  replaceBtn: document.getElementById("replace-btn"),
  replaceAllBtn: document.getElementById("replace-all-btn"),

  // Go to Line
  gotoLineInput: document.getElementById("goto-line-input"),
  gotoBtn: document.getElementById("goto-btn"),

  // Settings
  themeSelect: document.getElementById("theme-select"),
  fontSizeInput: document.getElementById("font-size-input"),
  fontFamilySelect: document.getElementById("font-family-select"),
  lineNumbersToggle: document.getElementById("line-numbers-toggle"),
  wordWrapToggle: document.getElementById("word-wrap-toggle"),
  minimapToggle: document.getElementById("minimap-toggle"),
  tabSizeSelect: document.getElementById("tab-size-select"),
  resetSettingsBtn: document.getElementById("reset-settings"),
  saveSettingsBtn: document.getElementById("save-settings"),

  // Diff
  diffFile1: document.getElementById("diff-file-1"),
  diffFile2: document.getElementById("diff-file-2"),
  diffView: document.getElementById("diff-view"),
  runDiffBtn: document.getElementById("run-diff-btn"),

  // Split View
  splitViewContainer: document.getElementById("split-view-container"),
  leftPane: document.getElementById("left-pane"),
  rightPane: document.getElementById("right-pane"),
  splitDivider: document.getElementById("split-divider"),

  // Toast & Context Menu
  toastContainer: document.getElementById("toast-container"),
  contextMenu: document.getElementById("context-menu"),

  // Loading
  loadingScreen: document.getElementById("loading-screen"),
};

// =====================================================
// Utility Functions
// =====================================================
const Utils = {
  generateId() {
    return "file_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  },

  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  getFileExtension(filename) {
    return filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
  },

  getFileLanguage(filename) {
    const ext = this.getFileExtension(filename);
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      go: "go",
      rs: "rust",
      php: "php",
      html: "html",
      htm: "html",
      css: "css",
      scss: "scss",
      sass: "sass",
      less: "less",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
      markdown: "markdown",
      sql: "sql",
      sh: "bash",
      bash: "bash",
      zsh: "bash",
      ps1: "powershell",
      dockerfile: "dockerfile",
      makefile: "makefile",
      toml: "toml",
      ini: "ini",
      conf: "ini",
      cfg: "ini",
    };
    return languageMap[ext] || "plaintext";
  },

  getFileIcon(filename) {
    const ext = this.getFileExtension(filename);
    const iconMap = {
      pdf: "file-text",
      doc: "file-text",
      docx: "file-text",
      xls: "file-spreadsheet",
      xlsx: "file-spreadsheet",
      ppt: "file-presentation",
      pptx: "file-presentation",
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      svg: "image",
      webp: "image",
      mp4: "video",
      webm: "video",
      mp3: "audio",
      wav: "audio",
      zip: "file-archive",
      rar: "file-archive",
      "7z": "file-archive",
      js: "file-code",
      ts: "file-code",
      py: "file-code",
      java: "file-code",
      html: "file-code",
      css: "file-code",
      json: "file-json",
      yaml: "file-code",
      yml: "file-code",
      md: "file-text",
      txt: "file-text",
    };
    return iconMap[ext] || "file";
  },

  isTextFile(filename) {
    const ext = this.getFileExtension(filename);
    const textExtensions = [
      "txt",
      "md",
      "markdown",
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "rb",
      "java",
      "c",
      "cpp",
      "cs",
      "go",
      "rs",
      "php",
      "html",
      "htm",
      "css",
      "scss",
      "sass",
      "less",
      "json",
      "xml",
      "yaml",
      "yml",
      "sql",
      "sh",
      "bash",
      "zsh",
      "ps1",
      "dockerfile",
      "makefile",
      "toml",
      "ini",
      "conf",
      "cfg",
      "log",
      "env",
      "gitignore",
      "editorconfig",
      "eslintrc",
      "prettierrc",
      "vue",
      "svelte",
      "astro",
      "prisma",
      "graphql",
      "proto",
      "tf",
      "hcl",
    ];
    return textExtensions.includes(ext) || ext === "";
  },

  isPDF(filename) {
    return this.getFileExtension(filename) === "pdf";
  },

  isImage(filename) {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "svg",
      "webp",
      "bmp",
      "ico",
    ];
    return imageExtensions.includes(this.getFileExtension(filename));
  },

  isWord(filename) {
    const wordExtensions = ["doc", "docx"];
    return wordExtensions.includes(this.getFileExtension(filename));
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// =====================================================
// Toast Notifications
// =====================================================
const Toast = {
  show(message, type = "info", duration = 4000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "check-circle",
      error: "x-circle",
      warning: "alert-triangle",
      info: "info",
    };

    toast.innerHTML = `
            <i data-lucide="${icons[type]}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <i data-lucide="x"></i>
            </button>
        `;

    DOM.toastContainer.appendChild(toast);
    lucide.createIcons({ icons: lucide.icons, nameAttr: "data-lucide" });

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => this.dismiss(toast));

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }

    return toast;
  },

  dismiss(toast) {
    toast.style.animation = "fadeIn 200ms ease reverse";
    setTimeout(() => toast.remove(), 200);
  },

  success(message) {
    return this.show(message, "success");
  },
  error(message) {
    return this.show(message, "error");
  },
  warning(message) {
    return this.show(message, "warning");
  },
  info(message) {
    return this.show(message, "info");
  },
};

// =====================================================
// Theme Management
// =====================================================
const Theme = {
  current: "dark",

  init() {
    const saved = localStorage.getItem("openfile-theme");
    if (saved) {
      this.set(saved);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.set("light");
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (AppState.settings.theme === "system") {
          this.set(e.matches ? "dark" : "light", false);
        }
      });
  },

  set(theme, save = true) {
    this.current = theme;
    document.documentElement.setAttribute("data-theme", theme);

    // Update icons
    if (theme === "dark") {
      DOM.themeIconDark.classList.remove("hidden");
      DOM.themeIconLight.classList.add("hidden");
    } else {
      DOM.themeIconDark.classList.add("hidden");
      DOM.themeIconLight.classList.remove("hidden");
    }

    // Update syntax highlighting theme
    const hljsTheme = document.getElementById("hljs-theme-dark");
    if (hljsTheme) {
      hljsTheme.href =
        theme === "dark"
          ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
          : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
    }

    if (save) {
      localStorage.setItem("openfile-theme", theme);
      AppState.settings.theme = theme;
    }
  },

  toggle() {
    this.set(this.current === "dark" ? "light" : "dark");
  },
};

// =====================================================
// File Handler
// =====================================================
const FileHandler = {
  async open(file) {
    const fileId = Utils.generateId();
    const fileData = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      content: null,
      language: Utils.getFileLanguage(file.name),
    };

    try {
      DOM.loadingScreen.classList.remove("hidden");

      if (Utils.isPDF(file.name)) {
        fileData.content = await this.readAsArrayBuffer(file);
        fileData.type = "pdf";
      } else if (Utils.isImage(file.name)) {
        fileData.content = await this.readAsDataURL(file);
        fileData.type = "image";
      } else if (Utils.isWord(file.name)) {
        fileData.content = await this.readAsArrayBuffer(file);
        fileData.type = "word";
      } else {
        fileData.content = await this.readAsText(file);
        fileData.type = "text";
      }

      AppState.files.set(fileId, fileData);
      TabManager.create(fileId, file.name);
      Sidebar.update();
      Toast.success(`Opened: ${file.name}`);

      DOM.loadingScreen.classList.add("hidden");
      return fileId;
    } catch (error) {
      DOM.loadingScreen.classList.add("hidden");
      Toast.error(`Failed to open: ${file.name}`);
      console.error("File open error:", error);
      return null;
    }
  },

  readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// =====================================================
// Tab Manager
// =====================================================
const TabManager = {
  create(fileId, fileName) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.tabId = fileId;

    const icon = Utils.getFileIcon(fileName);
    tab.innerHTML = `
            <i data-lucide="${icon}"></i>
            <span>${fileName}</span>
            <span class="close-tab">
                <i data-lucide="x"></i>
            </span>
        `;

    // Remove welcome tab if it exists
    const welcomeTab = DOM.tabsContainer.querySelector(".welcome-tab");
    if (welcomeTab) {
      welcomeTab.remove();
    }

    DOM.tabsContainer.appendChild(tab);
    lucide.createIcons({ icons: lucide.icons, nameAttr: "data-lucide" });

    // Tab click event
    tab.addEventListener("click", (e) => {
      if (!e.target.closest(".close-tab")) {
        this.activate(fileId);
      }
    });

    // Close tab event
    const closeBtn = tab.querySelector(".close-tab");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close(fileId);
    });

    // Create viewer panel
    Viewer.create(fileId);

    // Activate the new tab
    this.activate(fileId);
  },

  activate(tabId) {
    // Deactivate all tabs
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".viewer-panel")
      .forEach((p) => p.classList.remove("active"));

    // Activate selected tab
    const tab = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    const panel = document.querySelector(
      `.viewer-panel[data-panel-id="${tabId}"]`,
    );

    if (tab) tab.classList.add("active");
    if (panel) panel.classList.add("active");

    AppState.activeTabId = tabId;

    // Show/hide welcome panel
    if (tabId === "welcome") {
      DOM.welcomePanel.classList.remove("hidden");
      DOM.viewerPanels.classList.remove("active");
    } else {
      DOM.welcomePanel.classList.add("hidden");
      DOM.viewerPanels.classList.add("active");
    }

    // Update status bar
    StatusBar.update();

    // Update sidebar active state
    Sidebar.setActive(tabId);
  },

  close(fileId) {
    const tab = document.querySelector(`.tab[data-tab-id="${fileId}"]`);
    const panel = document.querySelector(
      `.viewer-panel[data-panel-id="${fileId}"]`,
    );

    if (tab) tab.remove();
    if (panel) panel.remove();

    AppState.files.delete(fileId);
    Sidebar.update();

    // If closing active tab, switch to another
    if (AppState.activeTabId === fileId) {
      const remainingTabs = document.querySelectorAll(".tab");
      if (remainingTabs.length > 0) {
        this.activate(remainingTabs[remainingTabs.length - 1].dataset.tabId);
      } else {
        // Show welcome screen
        this.showWelcome();
      }
    }
  },

  closeAll() {
    AppState.files.forEach((_, fileId) => {
      const tab = document.querySelector(`.tab[data-tab-id="${fileId}"]`);
      const panel = document.querySelector(
        `.viewer-panel[data-panel-id="${fileId}"]`,
      );
      if (tab) tab.remove();
      if (panel) panel.remove();
    });
    AppState.files.clear();
    Sidebar.update();
    this.showWelcome();
  },

  showWelcome() {
    // Add welcome tab
    const welcomeTab = document.createElement("div");
    welcomeTab.className = "tab welcome-tab active";
    welcomeTab.dataset.tabId = "welcome";
    welcomeTab.innerHTML = `
            <i data-lucide="home"></i>
            <span>Welcome</span>
        `;
    DOM.tabsContainer.appendChild(welcomeTab);
    lucide.createIcons({ icons: lucide.icons, nameAttr: "data-lucide" });

    welcomeTab.addEventListener("click", () => this.activate("welcome"));

    this.activate("welcome");
  },
};

// =====================================================
// Viewer
// =====================================================
const Viewer = {
  create(fileId) {
    const fileData = AppState.files.get(fileId);
    if (!fileData) return;

    const panel = document.createElement("div");
    panel.className = "viewer-panel";
    panel.dataset.panelId = fileId;

    switch (fileData.type) {
      case "pdf":
        this.renderPDF(panel, fileData);
        break;
      case "image":
        this.renderImage(panel, fileData);
        break;
      case "word":
        this.renderWord(panel, fileData);
        break;
      default:
        this.renderText(panel, fileData);
    }

    DOM.viewerPanels.appendChild(panel);
  },

  renderText(panel, fileData) {
    const lines = fileData.content.split("\n");
    const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join("");

    // Apply syntax highlighting
    let highlightedContent;
    try {
      const result = hljs.highlight(fileData.content, {
        language: fileData.language,
      });
      highlightedContent = result.value;
    } catch {
      highlightedContent = Utils.escapeHtml(fileData.content);
    }

    panel.innerHTML = `
            <div class="code-viewer">
                <div class="line-numbers" data-file-id="${fileData.id}">
                    ${lineNumbers}
                </div>
                <div class="code-content" data-file-id="${fileData.id}" contenteditable="false">
                    <pre><code class="hljs language-${fileData.language}">${highlightedContent}</code></pre>
                </div>
                ${
                  AppState.settings.minimap
                    ? `
                <div class="minimap" data-file-id="${fileData.id}">
                    <div class="minimap-content">${Utils.escapeHtml(fileData.content.substring(0, 5000))}</div>
                    <div class="minimap-viewport"></div>
                </div>
                `
                    : ""
                }
            </div>
        `;

    // Setup scroll sync for minimap
    this.setupMinimapSync(panel, fileData.id);

    // Setup selection tracking
    this.setupSelectionTracking(panel);
  },

  renderPDF(panel, fileData) {
    panel.innerHTML = `
            <div class="pdf-viewer">
                <div class="pdf-toolbar">
                    <button class="secondary-btn pdf-prev-btn">
                        <i data-lucide="chevron-left"></i> Previous
                    </button>
                    <span class="pdf-page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
                    <button class="secondary-btn pdf-next-btn">
                        Next <i data-lucide="chevron-right"></i>
                    </button>
                </div>
                <div class="pdf-container"></div>
            </div>
        `;

    lucide.createIcons({ icons: lucide.icons, nameAttr: "data-lucide" });

    // Render PDF using PDF.js
    this.loadPDF(panel, fileData);
  },

  async loadPDF(panel, fileData) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const pdf = await pdfjsLib.getDocument({ data: fileData.content })
        .promise;
      const container = panel.querySelector(".pdf-container");
      const totalPagesEl = panel.querySelector(".total-pages");
      const currentPageEl = panel.querySelector(".current-page");
      const prevBtn = panel.querySelector(".pdf-prev-btn");
      const nextBtn = panel.querySelector(".pdf-next-btn");

      totalPagesEl.textContent = pdf.numPages;

      let currentPage = 1;

      const renderPage = async (pageNum) => {
        container.innerHTML = "";
        const page = await pdf.getPage(pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.className = "pdf-page";
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        container.appendChild(canvas);

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        currentPageEl.textContent = pageNum;
      };

      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentPage < pdf.numPages) {
          currentPage++;
          renderPage(currentPage);
        }
      });

      await renderPage(1);
    } catch (error) {
      console.error("PDF render error:", error);
      panel.innerHTML = '<div class="error-message">Failed to render PDF</div>';
    }
  },

  renderImage(panel, fileData) {
    panel.innerHTML = `
            <div class="image-viewer">
                <img src="${fileData.content}" alt="${fileData.name}">
            </div>
        `;
  },

  async renderWord(panel, fileData) {
    panel.innerHTML = `
            <div class="docx-viewer">
                <div class="docx-content">Loading document...</div>
            </div>
        `;

    try {
      const result = await mammoth.convertToHtml({
        arrayBuffer: fileData.content,
      });
      const contentEl = panel.querySelector(".docx-content");
      contentEl.innerHTML = result.value;
    } catch (error) {
      console.error("Word render error:", error);
      panel.querySelector(".docx-content").innerHTML =
        "<p>Failed to render document</p>";
    }
  },

  setupMinimapSync(panel, fileId) {
    const codeContent = panel.querySelector(".code-content");
    const minimap = panel.querySelector(".minimap");
    const viewport = panel.querySelector(".minimap-viewport");

    if (!codeContent || !minimap || !viewport) return;

    const updateViewport = () => {
      const scrollRatio =
        codeContent.scrollTop /
        (codeContent.scrollHeight - codeContent.clientHeight);
      const viewportHeight =
        (codeContent.clientHeight / codeContent.scrollHeight) *
        minimap.clientHeight;
      const viewportTop = scrollRatio * (minimap.clientHeight - viewportHeight);

      viewport.style.height = `${viewportHeight}px`;
      viewport.style.top = `${viewportTop}px`;
    };

    codeContent.addEventListener("scroll", updateViewport);
    updateViewport();
  },

  setupSelectionTracking(panel) {
    const codeContent = panel.querySelector(".code-content");
    if (!codeContent) return;

    codeContent.addEventListener("mouseup", () => {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        StatusBar.updateCursor(selection);
      }
    });
  },

  getActiveContent() {
    const activePanel = document.querySelector(".viewer-panel.active");
    if (!activePanel) return null;

    const codeContent = activePanel.querySelector(".code-content");
    return codeContent ? codeContent.textContent : null;
  },
};

// =====================================================
// Sidebar
// =====================================================
const Sidebar = {
  update() {
    if (AppState.files.size === 0) {
      DOM.fileList.innerHTML = '<p class="empty-state">No files open</p>';
      return;
    }

    let html = "";
    AppState.files.forEach((file, fileId) => {
      const icon = Utils.getFileIcon(file.name);
      const isActive = fileId === AppState.activeTabId;
      html += `
                <div class="file-item ${isActive ? "active" : ""}" data-file-id="${fileId}">
                    <i data-lucide="${icon}"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${Utils.formatFileSize(file.size)}</span>
                </div>
            `;
    });

    DOM.fileList.innerHTML = html;
    lucide.createIcons({ icons: lucide.icons, nameAttr: "data-lucide" });

    // Add click events
    document.querySelectorAll(".file-item").forEach((item) => {
      item.addEventListener("click", () => {
        TabManager.activate(item.dataset.fileId);
      });
    });
  },

  setActive(fileId) {
    document.querySelectorAll(".file-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.fileId === fileId);
    });
  },
};

// =====================================================
// Status Bar
// =====================================================
const StatusBar = {
  update() {
    const fileData = AppState.files.get(AppState.activeTabId);

    if (!fileData) {
      DOM.fileTypeStatus.querySelector("span").textContent = "No file";
      DOM.fileSizeStatus.querySelector("span").textContent = "0 B";
      DOM.linesStatus.querySelector("span").textContent = "0 lines";
      return;
    }

    // File type
    const ext = Utils.getFileExtension(fileData.name).toUpperCase() || "TXT";
    DOM.fileTypeStatus.querySelector("span").textContent = ext;

    // File size
    DOM.fileSizeStatus.querySelector("span").textContent = Utils.formatFileSize(
      fileData.size,
    );

    // Lines count
    if (fileData.type === "text" && fileData.content) {
      const lines = fileData.content.split("\n").length;
      DOM.linesStatus.querySelector("span").textContent = `${lines} lines`;
    } else {
      DOM.linesStatus.querySelector("span").textContent = "-";
    }
  },

  updateCursor(selection) {
    if (!selection || selection.toString().length === 0) {
      DOM.cursorStatus.querySelector("span").textContent = "Ln 1, Col 1";
      return;
    }

    const range = selection.getRangeAt(0);
    const text = selection.toString();
    const chars = text.length;
    const lines = text.split("\n").length;

    DOM.cursorStatus.querySelector("span").textContent =
      `${chars} chars selected (${lines} lines)`;
  },

  updateZoom(level) {
    AppState.zoom = level;
    DOM.zoomLevel.textContent = `${level}%`;

    // Apply zoom to editor
    document.querySelectorAll(".code-content").forEach((el) => {
      el.style.fontSize = `${AppState.settings.fontSize * (level / 100)}px`;
    });
  },
};

// =====================================================
// Search & Replace
// =====================================================
const Search = {
  find(query, options = {}) {
    AppState.search.query = query;
    AppState.search.caseSensitive = options.caseSensitive || false;
    AppState.search.regex = options.regex || false;
    AppState.search.wholeWord = options.wholeWord || false;

    const content = Viewer.getActiveContent();
    if (!content || !query) {
      this.clearHighlights();
      DOM.findResults.querySelector("span").textContent = "0 results";
      return;
    }

    let matches = [];
    let searchRegex;

    try {
      let pattern = options.regex
        ? query
        : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (options.wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      searchRegex = new RegExp(pattern, options.caseSensitive ? "g" : "gi");

      let match;
      while ((match = searchRegex.exec(content)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        });
      }
    } catch (e) {
      Toast.error("Invalid regex pattern");
      return;
    }

    AppState.search.matches = matches;
    AppState.search.currentIndex = 0;

    DOM.findResults.querySelector("span").textContent =
      `${matches.length} results`;

    if (matches.length > 0) {
      this.highlightMatches();
      this.goToMatch(0);
    } else {
      this.clearHighlights();
    }
  },

  highlightMatches() {
    // For simplicity, we'll use a visual indicator
    // Full implementation would require more complex DOM manipulation
    const activePanel = document.querySelector(".viewer-panel.active");
    if (!activePanel) return;
  },

  clearHighlights() {
    document.querySelectorAll(".search-highlight").forEach((el) => {
      el.outerHTML = el.textContent;
    });
  },

  goToMatch(index) {
    if (AppState.search.matches.length === 0) return;

    AppState.search.currentIndex = index;
    if (index < 0)
      AppState.search.currentIndex = AppState.search.matches.length - 1;
    if (index >= AppState.search.matches.length)
      AppState.search.currentIndex = 0;

    const match = AppState.search.matches[AppState.search.currentIndex];
    // Scroll to match position
  },

  next() {
    this.goToMatch(AppState.search.currentIndex + 1);
  },

  prev() {
    this.goToMatch(AppState.search.currentIndex - 1);
  },

  replace(replaceText) {
    if (AppState.search.matches.length === 0) return;
    // Replace current match
    Toast.info("Replace functionality in read mode");
  },

  replaceAll(replaceText) {
    if (AppState.search.matches.length === 0) return;
    Toast.info(`Would replace ${AppState.search.matches.length} occurrences`);
  },
};

// =====================================================
// Clipboard Operations
// =====================================================
const Clipboard = {
  copy() {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      Toast.warning("No text selected");
      return;
    }

    navigator.clipboard
      .writeText(selection.toString())
      .then(() => Toast.success("Copied to clipboard"))
      .catch(() => Toast.error("Failed to copy"));
  },

  copyWithLineNumbers() {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      Toast.warning("No text selected");
      return;
    }

    const text = selection.toString();
    const lines = text.split("\n");
    const startLine = this.getSelectionStartLine();

    const numberedText = lines
      .map((line, i) => `${startLine + i}: ${line}`)
      .join("\n");

    navigator.clipboard
      .writeText(numberedText)
      .then(() => Toast.success("Copied with line numbers"))
      .catch(() => Toast.error("Failed to copy"));
  },

  getSelectionStartLine() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 1;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    const codeContent = document.querySelector(
      ".viewer-panel.active .code-content",
    );

    if (!codeContent) return 1;

    preCaretRange.selectNodeContents(codeContent);
    preCaretRange.setEnd(range.startContainer, range.startOffset);

    const textBefore = preCaretRange.toString();
    return textBefore.split("\n").length;
  },

  selectAll() {
    const codeContent = document.querySelector(
      ".viewer-panel.active .code-content",
    );
    if (!codeContent) return;

    const range = document.createRange();
    range.selectNodeContents(codeContent);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    Toast.info("All text selected");
  },
};

// =====================================================
// Download Handler
// =====================================================
const Download = {
  current() {
    const fileData = AppState.files.get(AppState.activeTabId);
    if (!fileData) {
      Toast.warning("No file to download");
      return;
    }

    let blob;
    if (fileData.type === "text") {
      blob = new Blob([fileData.content], { type: "text/plain" });
    } else if (fileData.type === "image") {
      // For images, we need to convert data URL to blob
      const byteString = atob(fileData.content.split(",")[1]);
      const mimeType = fileData.content.split(",")[0].match(/:(.*?);/)[1];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([ab], { type: mimeType });
    } else {
      blob = new Blob([fileData.content]);
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Toast.success(`Downloaded: ${fileData.name}`);
  },
};

// =====================================================
// Diff View
// =====================================================
const DiffView = {
  init() {
    this.updateFileSelectors();
  },

  updateFileSelectors() {
    const options =
      '<option value="">Select a file...</option>' +
      Array.from(AppState.files.entries())
        .filter(([_, file]) => file.type === "text")
        .map(([id, file]) => `<option value="${id}">${file.name}</option>`)
        .join("");

    DOM.diffFile1.innerHTML = options;
    DOM.diffFile2.innerHTML = options;
  },

  compare() {
    const file1Id = DOM.diffFile1.value;
    const file2Id = DOM.diffFile2.value;

    if (!file1Id || !file2Id) {
      Toast.warning("Please select two files to compare");
      return;
    }

    const file1 = AppState.files.get(file1Id);
    const file2 = AppState.files.get(file2Id);

    if (!file1 || !file2) return;

    const lines1 = file1.content.split("\n");
    const lines2 = file2.content.split("\n");

    let html = "";
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      if (line1 === line2) {
        html += `
                    <div class="diff-line">
                        <span class="diff-line-number">${i + 1}</span>
                        <span class="diff-line-content">${Utils.escapeHtml(line1)}</span>
                    </div>
                `;
      } else {
        if (line1) {
          html += `
                        <div class="diff-line removed">
                            <span class="diff-line-number">${i + 1}</span>
                            <span class="diff-line-content">${Utils.escapeHtml(line1)}</span>
                        </div>
                    `;
        }
        if (line2) {
          html += `
                        <div class="diff-line added">
                            <span class="diff-line-number">${i + 1}</span>
                            <span class="diff-line-content">${Utils.escapeHtml(line2)}</span>
                        </div>
                    `;
        }
      }
    }

    DOM.diffView.innerHTML =
      html || '<div class="diff-placeholder"><p>Files are identical</p></div>';
  },
};

// =====================================================
// Settings Handler
// =====================================================
const Settings = {
  load() {
    const saved = localStorage.getItem("openfile-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        AppState.settings = { ...AppState.settings, ...parsed };
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    this.apply();
  },

  save() {
    // Get values from form
    AppState.settings.theme = DOM.themeSelect.value;
    AppState.settings.fontSize = parseInt(DOM.fontSizeInput.value);
    AppState.settings.fontFamily = DOM.fontFamilySelect.value;
    AppState.settings.lineNumbers = DOM.lineNumbersToggle.checked;
    AppState.settings.wordWrap = DOM.wordWrapToggle.checked;
    AppState.settings.minimap = DOM.minimapToggle.checked;
    AppState.settings.tabSize = parseInt(DOM.tabSizeSelect.value);

    localStorage.setItem(
      "openfile-settings",
      JSON.stringify(AppState.settings),
    );
    this.apply();
    Modal.close("settings-modal");
    Toast.success("Settings saved");
  },

  apply() {
    // Apply theme
    if (AppState.settings.theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      Theme.set(prefersDark ? "dark" : "light", false);
    } else {
      Theme.set(AppState.settings.theme, false);
    }

    // Apply font settings
    document.documentElement.style.setProperty(
      "--font-code",
      AppState.settings.fontFamily,
    );
    document.documentElement.style.setProperty(
      "--font-size-md",
      `${AppState.settings.fontSize}px`,
    );

    // Apply line numbers
    document.querySelectorAll(".line-numbers").forEach((el) => {
      el.style.display = AppState.settings.lineNumbers ? "flex" : "none";
    });

    // Apply word wrap
    document.querySelectorAll(".code-content").forEach((el) => {
      el.classList.toggle("word-wrap", AppState.settings.wordWrap);
    });

    // Apply minimap
    document.querySelectorAll(".minimap").forEach((el) => {
      el.style.display = AppState.settings.minimap ? "block" : "none";
    });

    // Update form values
    DOM.themeSelect.value = AppState.settings.theme;
    DOM.fontSizeInput.value = AppState.settings.fontSize;
    DOM.fontFamilySelect.value = AppState.settings.fontFamily;
    DOM.lineNumbersToggle.checked = AppState.settings.lineNumbers;
    DOM.wordWrapToggle.checked = AppState.settings.wordWrap;
    DOM.minimapToggle.checked = AppState.settings.minimap;
    DOM.tabSizeSelect.value = AppState.settings.tabSize;

    // Update toolbar button states
    DOM.lineNumbersBtn.classList.toggle(
      "active",
      AppState.settings.lineNumbers,
    );
    DOM.wordWrapBtn.classList.toggle("active", AppState.settings.wordWrap);
    DOM.minimapBtn.classList.toggle("active", AppState.settings.minimap);
  },

  reset() {
    AppState.settings = {
      theme: "dark",
      fontSize: 14,
      fontFamily: "'Fira Code', monospace",
      lineNumbers: true,
      wordWrap: false,
      minimap: true,
      tabSize: 4,
    };
    localStorage.removeItem("openfile-settings");
    this.apply();
    Toast.info("Settings reset to defaults");
  },
};

// =====================================================
// Modal Handler
// =====================================================
const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");

      // Special init for diff modal
      if (modalId === "diff-modal") {
        DiffView.updateFileSelectors();
      }
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  },

  closeAll() {
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.add("hidden"));
  },
};

// =====================================================
// Context Menu
// =====================================================
const ContextMenu = {
  show(x, y) {
    DOM.contextMenu.style.left = `${x}px`;
    DOM.contextMenu.style.top = `${y}px`;
    DOM.contextMenu.classList.remove("hidden");
  },

  hide() {
    DOM.contextMenu.classList.add("hidden");
  },

  handleAction(action) {
    switch (action) {
      case "copy":
        Clipboard.copy();
        break;
      case "copy-lines":
        Clipboard.copyWithLineNumbers();
        break;
      case "select-all":
        Clipboard.selectAll();
        break;
      case "select-line":
        // Select current line
        break;
      case "find":
        Modal.open("find-replace-modal");
        break;
      case "goto":
        Modal.open("goto-line-modal");
        break;
    }
    this.hide();
  },
};

// =====================================================
// Keyboard Shortcuts
// =====================================================
const Shortcuts = {
  init() {
    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+O - Open file
      if (ctrlKey && e.key === "o") {
        e.preventDefault();
        DOM.fileInput.click();
      }

      // Ctrl+F - Find
      if (ctrlKey && e.key === "f") {
        e.preventDefault();
        Modal.open("find-replace-modal");
        DOM.findInput.focus();
      }

      // Ctrl+H - Replace
      if (ctrlKey && e.key === "h") {
        e.preventDefault();
        Modal.open("find-replace-modal");
        DOM.replaceInput.focus();
      }

      // Ctrl+G - Go to line
      if (ctrlKey && e.key === "g") {
        e.preventDefault();
        Modal.open("goto-line-modal");
        DOM.gotoLineInput.focus();
      }

      // Ctrl+S - Download
      if (ctrlKey && e.key === "s") {
        e.preventDefault();
        Download.current();
      }

      // Ctrl+W - Close tab
      if (ctrlKey && e.key === "w") {
        e.preventDefault();
        if (AppState.activeTabId !== "welcome") {
          TabManager.close(AppState.activeTabId);
        }
      }

      // Ctrl+Shift+T - Toggle theme
      if (ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        Theme.toggle();
      }

      // Ctrl+\ - Split view
      if (ctrlKey && e.key === "\\") {
        e.preventDefault();
        // Toggle split view
      }

      // Ctrl+P - Print
      if (ctrlKey && e.key === "p") {
        e.preventDefault();
        window.print();
      }

      // Escape - Close modals
      if (e.key === "Escape") {
        Modal.closeAll();
        ContextMenu.hide();
      }

      // Ctrl+Plus/Minus - Zoom
      if (ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        StatusBar.updateZoom(Math.min(AppState.zoom + 10, 200));
      }

      if (ctrlKey && e.key === "-") {
        e.preventDefault();
        StatusBar.updateZoom(Math.max(AppState.zoom - 10, 50));
      }

      if (ctrlKey && e.key === "0") {
        e.preventDefault();
        StatusBar.updateZoom(100);
      }
    });
  },
};

// =====================================================
// Drag & Drop Handler
// =====================================================
const DragDrop = {
  init() {
    const dropZone = DOM.dropZone;
    const body = document.body;

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Highlight drop zone
    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove("drag-over");
      });
    });

    // Handle drop anywhere on the page
    body.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      this.handleFiles(files);
    });

    // Handle file input
    DOM.fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
      DOM.fileInput.value = ""; // Reset for same file selection
    });
  },

  handleFiles(files) {
    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      FileHandler.open(file);
    });
  },
};

// =====================================================
// Event Listeners Setup
// =====================================================
function setupEventListeners() {
  // Browse button
  DOM.browseBtn.addEventListener("click", () => DOM.fileInput.click());

  // Drop zone click
  DOM.dropZone.addEventListener("click", (e) => {
    if (e.target === DOM.dropZone || e.target.closest(".drop-zone-content")) {
      DOM.fileInput.click();
    }
  });

  // New tab button
  DOM.newTabBtn.addEventListener("click", () => DOM.fileInput.click());

  // Theme toggle
  DOM.themeToggle.addEventListener("click", () => Theme.toggle());

  // Settings button
  DOM.settingsBtn.addEventListener("click", () => Modal.open("settings-modal"));

  // Diff view button
  DOM.diffViewBtn.addEventListener("click", () => Modal.open("diff-modal"));

  // Clear all files
  DOM.clearAllBtn.addEventListener("click", () => {
    if (AppState.files.size > 0) {
      TabManager.closeAll();
      Toast.info("All files closed");
    }
  });

  // Toolbar buttons
  DOM.copyBtn.addEventListener("click", () => Clipboard.copy());
  DOM.copyWithLinesBtn.addEventListener("click", () =>
    Clipboard.copyWithLineNumbers(),
  );
  DOM.selectAllBtn.addEventListener("click", () => Clipboard.selectAll());
  DOM.findReplaceBtn.addEventListener("click", () =>
    Modal.open("find-replace-modal"),
  );
  DOM.goToLineBtn.addEventListener("click", () =>
    Modal.open("goto-line-modal"),
  );
  DOM.downloadBtn.addEventListener("click", () => Download.current());
  DOM.printBtn.addEventListener("click", () => window.print());

  // Toggle buttons
  DOM.wordWrapBtn.addEventListener("click", () => {
    AppState.settings.wordWrap = !AppState.settings.wordWrap;
    Settings.apply();
  });

  DOM.lineNumbersBtn.addEventListener("click", () => {
    AppState.settings.lineNumbers = !AppState.settings.lineNumbers;
    Settings.apply();
  });

  DOM.minimapBtn.addEventListener("click", () => {
    AppState.settings.minimap = !AppState.settings.minimap;
    Settings.apply();
  });

  // Zoom controls
  DOM.zoomIn.addEventListener("click", () => {
    StatusBar.updateZoom(Math.min(AppState.zoom + 10, 200));
  });

  DOM.zoomOut.addEventListener("click", () => {
    StatusBar.updateZoom(Math.max(AppState.zoom - 10, 50));
  });

  // Find & Replace modal
  document
    .getElementById("close-find-replace")
    .addEventListener("click", () => {
      Modal.close("find-replace-modal");
    });

  DOM.findInput.addEventListener(
    "input",
    Utils.debounce(() => {
      Search.find(DOM.findInput.value, {
        caseSensitive: DOM.caseSensitiveBtn.classList.contains("active"),
        regex: DOM.regexBtn.classList.contains("active"),
        wholeWord: DOM.wholeWordBtn.classList.contains("active"),
      });
    }, 300),
  );

  DOM.caseSensitiveBtn.addEventListener("click", () => {
    DOM.caseSensitiveBtn.classList.toggle("active");
    Search.find(DOM.findInput.value, {
      caseSensitive: DOM.caseSensitiveBtn.classList.contains("active"),
      regex: DOM.regexBtn.classList.contains("active"),
      wholeWord: DOM.wholeWordBtn.classList.contains("active"),
    });
  });

  DOM.regexBtn.addEventListener("click", () => {
    DOM.regexBtn.classList.toggle("active");
  });

  DOM.wholeWordBtn.addEventListener("click", () => {
    DOM.wholeWordBtn.classList.toggle("active");
  });

  DOM.findPrevBtn.addEventListener("click", () => Search.prev());
  DOM.findNextBtn.addEventListener("click", () => Search.next());
  DOM.replaceBtn.addEventListener("click", () =>
    Search.replace(DOM.replaceInput.value),
  );
  DOM.replaceAllBtn.addEventListener("click", () =>
    Search.replaceAll(DOM.replaceInput.value),
  );

  // Go to Line modal
  document.getElementById("close-goto-line").addEventListener("click", () => {
    Modal.close("goto-line-modal");
  });

  document.getElementById("cancel-goto").addEventListener("click", () => {
    Modal.close("goto-line-modal");
  });

  DOM.gotoBtn.addEventListener("click", () => {
    const lineNum = parseInt(DOM.gotoLineInput.value);
    if (lineNum > 0) {
      // Go to line implementation
      Toast.info(`Go to line ${lineNum}`);
      Modal.close("goto-line-modal");
    }
  });

  // Settings modal
  document.getElementById("close-settings").addEventListener("click", () => {
    Modal.close("settings-modal");
  });

  DOM.saveSettingsBtn.addEventListener("click", () => Settings.save());
  DOM.resetSettingsBtn.addEventListener("click", () => Settings.reset());

  // Diff modal
  document.getElementById("close-diff").addEventListener("click", () => {
    Modal.close("diff-modal");
  });

  DOM.runDiffBtn.addEventListener("click", () => DiffView.compare());

  // Global search
  DOM.globalSearch.addEventListener(
    "input",
    Utils.debounce(() => {
      Search.find(DOM.globalSearch.value);
    }, 300),
  );

  DOM.globalSearch.addEventListener("focus", () => {
    Modal.open("find-replace-modal");
    DOM.findInput.value = DOM.globalSearch.value;
    DOM.findInput.focus();
  });

  // Context menu
  document.addEventListener("contextmenu", (e) => {
    const codeContent = e.target.closest(".code-content");
    if (codeContent) {
      e.preventDefault();
      ContextMenu.show(e.clientX, e.clientY);
    }
  });

  document.addEventListener("click", () => ContextMenu.hide());

  document.querySelectorAll(".context-item").forEach((item) => {
    item.addEventListener("click", () => {
      ContextMenu.handleAction(item.dataset.action);
    });
  });

  // Modal backdrop click to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        Modal.close(modal.id);
      }
    });
  });
}

// =====================================================
// Initialize Application
// =====================================================
function init() {
  // Initialize Lucide icons
  lucide.createIcons();

  // Load settings
  Settings.load();

  // Initialize theme
  Theme.init();

  // Initialize drag & drop
  DragDrop.init();

  // Initialize keyboard shortcuts
  Shortcuts.init();

  // Setup event listeners
  setupEventListeners();

  // Initial status bar update
  StatusBar.update();

  console.log("OpenFile Pro initialized successfully!");
}

// Run initialization when DOM is ready
document.addEventListener("DOMContentLoaded", init);
