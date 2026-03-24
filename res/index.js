var DUFS_MAX_UPLOADINGS = 1;
var DATA;
var DIR_EMPTY_NOTE;

const PARAMS = Object.fromEntries(new URLSearchParams(window.location.search).entries());

const IFRAME_FORMATS = [
  ".pdf",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
  ".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm",
  ".mp3", ".ogg", ".wav", ".m4a",
];

const MAX_SUBPATHS_COUNT = 1000;

const ICONS = {
  dir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>`,
  symlinkFile: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM6 4.5l4 3-4 3v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73.73-.84 1.69-1.27 2.88-1.27v-2H6z"></path></svg>`,
  symlinkDir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM1 3h5v1H1V3zm6 9v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73C4.86 8.43 5.82 8 7.01 8V6l4 3-4 3H7z"></path></svg>`,
  file: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`,
  move: `<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`,
  view: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/></svg>`,
};

const failUploaders = new Map();

let $pathsTable;
let $pathsTableHead;
let $pathsTableBody;
let $uploadersTable;
let $emptyFolder;
let $editor;
let $loginBtn;
let $logoutBtn;
let $userName;

window.addEventListener("DOMContentLoaded", async () => {
  const $indexData = document.getElementById("index-data");
  if (!$indexData) {
    alert("No data");
    return;
  }
  DATA = JSON.parse(decodeBase64($indexData.innerHTML));
  DIR_EMPTY_NOTE = PARAMS.q ? "No results" : DATA.dir_exists ? "Empty folder" : "Folder will be created when a file is uploaded";
  await ready();
});

async function ready() {
  $pathsTable = document.querySelector(".paths-table");
  $pathsTableHead = document.querySelector(".paths-table thead");
  $pathsTableBody = document.querySelector(".paths-table tbody");
  $uploadersTable = document.querySelector(".uploaders-table");
  $emptyFolder = document.querySelector(".empty-folder");
  $editor = document.querySelector(".editor");
  $loginBtn = document.querySelector(".login-btn");
  $logoutBtn = document.querySelector(".logout-btn");
  $userName = document.querySelector(".user-name");

  addBreadcrumb(DATA.href, DATA.uri_prefix);

  if (DATA.kind === "Index") {
    document.title = `Index of ${DATA.href} - Dufs`;
    document.querySelector(".index-page").classList.remove("hidden");
    await setupIndexPage();
  } else if (DATA.kind === "Edit") {
    document.title = `Edit ${DATA.href} - Dufs`;
    document.querySelector(".editor-page").classList.remove("hidden");
    await setupEditorPage();
  } else if (DATA.kind === "View") {
    document.title = `View ${DATA.href} - Dufs`;
    document.querySelector(".editor-page").classList.remove("hidden");
    await setupEditorPage();
  }
}

class Uploader {
  constructor(file, pathParts) {
    this.$uploadStatus = null;
    this.uploaded = 0;
    this.uploadOffset = 0;
    this.lastUptime = 0;
    this.name = [...pathParts, file.name].join("/");
    this.idx = Uploader.globalIdx++;
    this.file = file;
    this.url = newUrl(this.name);
  }

  upload() {
    const { idx, name, url } = this;
    const encodedName = encodedStr(name);
    $uploadersTable.insertAdjacentHTML("beforeend", `
  <tr id="upload${idx}" class="uploader">
    <td class="path cell-icon">
      ${getPathSvg()}
    </td>
    <td class="path cell-name">
      <a href="${url}">${encodedName}</a>
    </td>
    <td class="cell-status upload-status" id="uploadStatus${idx}"></td>
  </tr>`);
    $uploadersTable.classList.remove("hidden");
    $emptyFolder.classList.add("hidden");
    this.$uploadStatus = document.getElementById(`uploadStatus${idx}`);
    this.$uploadStatus.innerHTML = "-";
    this.$uploadStatus.addEventListener("click", e => {
      const matches = /^retry(\d+)$/.exec(e.target.id);
      if (matches) {
        const uploader = failUploaders.get(parseInt(matches[1]));
        if (uploader) uploader.retry();
      }
    });
    Uploader.queues.push(this);
    Uploader.runQueue();
  }

  ajax() {
    const { url } = this;
    this.uploaded = 0;
    this.lastUptime = Date.now();

    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", e => this.progress(e), false);
    ajax.addEventListener("readystatechange", () => {
      if (ajax.readyState === 4) {
        if (ajax.status >= 200 && ajax.status < 300) {
          this.complete();
        } else if (ajax.status != 0) {
          this.fail(`${ajax.status} ${ajax.statusText}`);
        }
      }
    });
    ajax.addEventListener("error", () => this.fail(), false);
    ajax.addEventListener("abort", () => this.fail(), false);
    if (this.uploadOffset > 0) {
      ajax.open("PATCH", url);
      ajax.setRequestHeader("X-Update-Range", "append");
      ajax.send(this.file.slice(this.uploadOffset));
    } else {
      ajax.open("PUT", url);
      ajax.send(this.file);
    }
  }

  async retry() {
    const { url } = this;
    const res = await fetch(url, { method: "HEAD" });
    let uploadOffset = 0;
    if (res.status == 200) {
      uploadOffset = parseInt(res.headers.get("content-length")) || 0;
    }
    this.uploadOffset = uploadOffset;
    this.ajax();
  }

  progress(event) {
    const now = Date.now();
    const speed = (event.loaded - this.uploaded) / (now - this.lastUptime) * 1000;
    const [speedValue, speedUnit] = formatFileSize(speed);
    const speedText = `${speedValue} ${speedUnit}/s`;
    const progress = formatPercent(((event.loaded + this.uploadOffset) / this.file.size) * 100);
    const duration = formatDuration((event.total - event.loaded) / speed);
    this.$uploadStatus.innerHTML = `<span style="width:80px">${speedText}</span><span>${progress} ${duration}</span>`;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  complete() {
    const $new = this.$uploadStatus.cloneNode(true);
    $new.innerHTML = `\u2713`;
    this.$uploadStatus.parentNode.replaceChild($new, this.$uploadStatus);
    this.$uploadStatus = null;
    failUploaders.delete(this.idx);
    Uploader.runnings--;
    Uploader.runQueue();
  }

  fail(reason = "") {
    this.$uploadStatus.innerHTML = `<span style="width:20px" title="${reason}">\u2717</span><span class="retry-btn" id="retry${this.idx}" title="Retry">\u21BB</span>`;
    failUploaders.set(this.idx, this);
    Uploader.runnings--;
    Uploader.runQueue();
  }
}

Uploader.globalIdx = 0;
Uploader.runnings = 0;
Uploader.auth = false;
Uploader.queues = [];

Uploader.runQueue = async () => {
  if (Uploader.runnings >= DUFS_MAX_UPLOADINGS) return;
  if (Uploader.queues.length == 0) return;
  Uploader.runnings++;
  const uploader = Uploader.queues.shift();
  if (!Uploader.auth) {
    Uploader.auth = true;
    try { await checkAuth(); } catch { Uploader.auth = false; }
  }
  uploader.ajax();
};

function addBreadcrumb(href, uri_prefix) {
  const $breadcrumb = document.querySelector(".breadcrumb");
  const parts = href === "/" ? [""] : href.split("/");
  const len = parts.length;
  let path = uri_prefix;
  for (let i = 0; i < len; i++) {
    const name = parts[i];
    if (i > 0) {
      if (!path.endsWith("/")) path += "/";
      path += encodeURIComponent(name);
    }
    const encodedName = encodedStr(name);
    if (i === 0) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}" title="Root"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg></a>`);
    } else if (i === len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<b>${encodedName}</b>`);
    } else {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}">${encodedName}</a>`);
    }
    if (i !== len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<span class="separator">/</span>`);
    }
  }
}

async function setupIndexPage() {
  if (DATA.allow_archive) {
    const $download = document.querySelector(".download");
    $download.href = baseUrl() + "?zip";
    $download.title = "Download folder as a .zip file";
    $download.classList.add("dlwt");
    $download.classList.remove("hidden");
  }

  if (DATA.allow_upload) {
    setupDropzone();
    setupUploadFile();
    setupNewFolder();
    setupNewFile();
  }

  if (DATA.auth) {
    await setupAuth();
  }

  if (DATA.allow_search) {
    setupSearch();
  }

  renderPathsTableHead();
  renderPathsTableBody();

  if (DATA.user) {
    setupDownloadWithToken();
  }
}

function renderPathsTableHead() {
  const headerItems = [
    { name: "name", props: `colspan="2"`, text: "Name" },
    { name: "mtime", props: ``, text: "Modified" },
    { name: "size", props: ``, text: "Size" },
  ];
  $pathsTableHead.insertAdjacentHTML("beforeend", `
    <tr>
      ${headerItems.map(item => {
        let svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/></svg>`;
        let order = "desc";
        if (PARAMS.sort === item.name) {
          if (PARAMS.order === "desc") {
            order = "asc";
            svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>`;
          } else {
            svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`;
          }
        }
        const qs = new URLSearchParams({ ...PARAMS, order, sort: item.name }).toString();
        return `<th class="cell-${item.name}" ${item.props}><a href="?${qs}">${item.text}<span>${svg}</span></a></th>`;
      }).join("\n")}
      <th class="cell-actions">Actions</th>
    </tr>
  `);
}

function renderPathsTableBody() {
  if (DATA.paths && DATA.paths.length > 0) {
    $pathsTable.classList.remove("hidden");
    for (let i = 0; i < DATA.paths.length; i++) {
      addPath(DATA.paths[i], i);
    }
  } else {
    $emptyFolder.textContent = DIR_EMPTY_NOTE;
    $emptyFolder.classList.remove("hidden");
  }
}

function addPath(file, index) {
  const encodedName = encodedStr(file.name);
  let url = newUrl(file.name);
  let actionDelete = "";
  let actionDownload = "";
  let actionMove = "";
  let actionEdit = "";
  let actionView = "";
  const isDir = file.path_type.endsWith("Dir");

  if (isDir) {
    url += "/";
    if (DATA.allow_archive) {
      actionDownload = `<div class="action-btn"><a class="dlwt" href="${url}?zip" title="Download as .zip" download>${ICONS.download}</a></div>`;
    }
  } else {
    actionDownload = `<div class="action-btn"><a class="dlwt" href="${url}" title="Download" download>${ICONS.download}</a></div>`;
  }

  if (DATA.allow_delete) {
    if (DATA.allow_upload) {
      actionMove = `<div onclick="movePath(${index})" class="action-btn" id="moveBtn${index}" title="Move">${ICONS.move}</div>`;
      if (!isDir) {
        actionEdit = `<a class="action-btn" title="Edit" target="_blank" href="${url}?edit">${ICONS.edit}</a>`;
      }
    }
    actionDelete = `<div onclick="deletePath(${index})" class="action-btn" id="deleteBtn${index}" title="Delete">${ICONS.delete}</div>`;
  }

  if (!actionEdit && !isDir) {
    actionView = `<a class="action-btn" title="View" target="_blank" href="${url}?view">${ICONS.view}</a>`;
  }

  const sizeDisplay = isDir ? formatDirSize(file.size) : formatFileSize(file.size).join(" ");

  $pathsTableBody.insertAdjacentHTML("beforeend", `
<tr id="addPath${index}">
  <td class="path cell-icon">${getPathSvg(file.path_type)}</td>
  <td class="path cell-name"><a href="${url}" ${isDir ? "" : `target="_blank"`}>${encodedName}</a></td>
  <td class="cell-mtime">${formatMtime(file.mtime)}</td>
  <td class="cell-size">${sizeDisplay}</td>
  <td class="cell-actions">${actionDownload}${actionView}${actionMove}${actionDelete}${actionEdit}</td>
</tr>`);
}

function setupDropzone() {
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(name => {
    document.addEventListener(name, e => { e.preventDefault(); e.stopPropagation(); });
  });
  document.addEventListener("drop", async e => {
    if (!e.dataTransfer.items[0].webkitGetAsEntry) {
      const files = Array.from(e.dataTransfer.files).filter(v => v.size > 0);
      for (const file of files) {
        new Uploader(file, []).upload();
      }
    } else {
      const entries = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        entries.push(e.dataTransfer.items[i].webkitGetAsEntry());
      }
      addFileEntries(entries, []);
    }
  });
}

async function setupAuth() {
  if (DATA.user) {
    $logoutBtn.classList.remove("hidden");
    $logoutBtn.addEventListener("click", logout);
    $userName.textContent = DATA.user;
  } else {
    $loginBtn.classList.remove("hidden");
    $loginBtn.addEventListener("click", async () => {
      try { await checkAuth("login"); } catch {}
      location.reload();
    });
  }
}

function setupDownloadWithToken() {
  document.querySelectorAll("a.dlwt").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      try {
        const link = e.currentTarget || e.target;
        const originalHref = link.getAttribute("href");
        const tokengenUrl = new URL(originalHref);
        tokengenUrl.searchParams.set("tokengen", "");
        const res = await fetch(tokengenUrl);
        if (!res.ok) throw new Error("Failed to fetch token");
        const token = await res.text();
        const downloadUrl = new URL(originalHref);
        downloadUrl.searchParams.set("token", token);
        const tempA = document.createElement("a");
        tempA.href = downloadUrl.toString();
        tempA.download = "";
        document.body.appendChild(tempA);
        tempA.click();
        document.body.removeChild(tempA);
      } catch (err) {
        alert(`Failed to download, ${err.message}`);
      }
    });
  });
}

function setupSearch() {
  const $searchbar = document.querySelector(".searchbar");
  $searchbar.classList.remove("hidden");
  $searchbar.addEventListener("submit", event => {
    event.preventDefault();
    const q = new FormData($searchbar).get("q");
    let href = baseUrl();
    if (q) href += "?q=" + q;
    location.href = href;
  });
  if (PARAMS.q) {
    document.getElementById("search").value = PARAMS.q;
  }
}

function setupUploadFile() {
  document.querySelector(".upload-file").classList.remove("hidden");
  document.getElementById("file").addEventListener("change", async e => {
    for (const file of e.target.files) {
      new Uploader(file, []).upload();
    }
  });
}

function setupNewFolder() {
  const $newFolder = document.querySelector(".new-folder");
  $newFolder.classList.remove("hidden");
  $newFolder.addEventListener("click", () => {
    const name = prompt("Enter folder name");
    if (name) createFolder(name);
  });
}

function setupNewFile() {
  const $newFile = document.querySelector(".new-file");
  $newFile.classList.remove("hidden");
  $newFile.addEventListener("click", () => {
    const name = prompt("Enter file name");
    if (name) createFile(name);
  });
}

async function setupEditorPage() {
  const url = baseUrl();

  const $download = document.querySelector(".download");
  $download.classList.remove("hidden");
  $download.href = url;

  if (DATA.kind == "Edit") {
    const $moveFile = document.querySelector(".move-file");
    $moveFile.classList.remove("hidden");
    $moveFile.addEventListener("click", async () => {
      const query = location.href.slice(url.length);
      const newFileUrl = await doMovePath(url);
      if (newFileUrl) location.href = newFileUrl + query;
    });

    const $deleteFile = document.querySelector(".delete-file");
    $deleteFile.classList.remove("hidden");
    $deleteFile.addEventListener("click", async () => {
      const url = baseUrl();
      const name = baseName(url);
      await doDeletePath(name, url, () => {
        location.href = location.href.split("/").slice(0, -1).join("/");
      });
    });

    if (DATA.editable) {
      const $saveBtn = document.querySelector(".save-btn");
      $saveBtn.classList.remove("hidden");
      $saveBtn.addEventListener("click", saveChange);
    }
  } else if (DATA.kind == "View") {
    $editor.readonly = true;
  }

  if (!DATA.editable) {
    const $notEditable = document.querySelector(".not-editable");
    const url = baseUrl();
    const ext = extName(baseName(url));
    if (IFRAME_FORMATS.find(v => v === ext)) {
      $notEditable.insertAdjacentHTML("afterend", `<iframe src="${url}" sandbox width="100%" height="${window.innerHeight - 100}px"></iframe>`);
    } else {
      $notEditable.classList.remove("hidden");
      $notEditable.textContent = "Cannot edit because file is too large or binary.";
    }
    return;
  }

  $editor.classList.remove("hidden");
  try {
    const res = await fetch(baseUrl());
    await assertResOK(res);
    const encoding = getEncoding(res.headers.get("content-type"));
    if (encoding === "utf-8") {
      $editor.value = await res.text();
    } else {
      const bytes = await res.arrayBuffer();
      $editor.value = new TextDecoder(encoding).decode(new DataView(bytes));
    }
  } catch (err) {
    alert(`Failed to get file, ${err.message}`);
  }
}

async function deletePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  await doDeletePath(file.name, newUrl(file.name), () => {
    document.getElementById(`addPath${index}`)?.remove();
    DATA.paths[index] = null;
    if (!DATA.paths.find(v => !!v)) {
      $pathsTable.classList.add("hidden");
      $emptyFolder.textContent = DIR_EMPTY_NOTE;
      $emptyFolder.classList.remove("hidden");
    }
  });
}

async function doDeletePath(name, url, cb) {
  if (!confirm(`Delete \`${name}\`?`)) return;
  try {
    await checkAuth();
    const res = await fetch(url, { method: "DELETE" });
    await assertResOK(res);
    cb();
  } catch (err) {
    alert(`Cannot delete \`${name}\`, ${err.message}`);
  }
}

async function movePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  const newFileUrl = await doMovePath(newUrl(file.name));
  if (newFileUrl) {
    location.href = newFileUrl.split("/").slice(0, -1).join("/");
  }
}

async function doMovePath(fileUrl) {
  const fileUrlObj = new URL(fileUrl);
  const prefix = DATA.uri_prefix.slice(0, -1);
  const filePath = decodeURIComponent(fileUrlObj.pathname.slice(prefix.length));

  let newPath = prompt("Enter new path", filePath);
  if (!newPath) return;
  if (!newPath.startsWith("/")) newPath = "/" + newPath;
  if (filePath === newPath) return;
  const newFileUrl = fileUrlObj.origin + prefix + newPath.split("/").map(encodeURIComponent).join("/");

  try {
    await checkAuth();
    const res1 = await fetch(newFileUrl, { method: "HEAD" });
    if (res1.status === 200) {
      if (!confirm("Override existing file?")) return;
    }
    const res2 = await fetch(fileUrl, {
      method: "MOVE",
      headers: { "Destination": newFileUrl },
    });
    await assertResOK(res2);
    return newFileUrl;
  } catch (err) {
    alert(`Cannot move \`${filePath}\` to \`${newPath}\`, ${err.message}`);
  }
}

async function saveChange() {
  try {
    await fetch(baseUrl(), { method: "PUT", body: $editor.value });
    location.reload();
  } catch (err) {
    alert(`Failed to save file, ${err.message}`);
  }
}

async function checkAuth(variant) {
  if (!DATA.auth) return;
  const qs = variant ? `?${variant}` : "";
  const res = await fetch(baseUrl() + qs, { method: "CHECKAUTH" });
  await assertResOK(res);
  $loginBtn.classList.add("hidden");
  $logoutBtn.classList.remove("hidden");
  $userName.textContent = await res.text();
}

function logout() {
  if (!DATA.auth) return;
  const url = baseUrl();
  const xhr = new XMLHttpRequest();
  xhr.open("LOGOUT", url, true, DATA.user);
  xhr.onload = () => { location.href = url; };
  xhr.send();
}

async function createFolder(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await fetch(url, { method: "MKCOL" });
    await assertResOK(res);
    location.href = url;
  } catch (err) {
    alert(`Cannot create folder \`${name}\`, ${err.message}`);
  }
}

async function createFile(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await fetch(url, { method: "PUT", body: "" });
    await assertResOK(res);
    location.href = url + "?edit";
  } catch (err) {
    alert(`Cannot create file \`${name}\`, ${err.message}`);
  }
}

async function addFileEntries(entries, dirs) {
  for (const entry of entries) {
    if (entry.isFile) {
      entry.file(file => { new Uploader(file, dirs).upload(); });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const successCallback = entries => {
        if (entries.length > 0) {
          addFileEntries(entries, [...dirs, entry.name]);
          dirReader.readEntries(successCallback);
        }
      };
      dirReader.readEntries(successCallback);
    }
  }
}

function newUrl(name) {
  let url = baseUrl();
  if (!url.endsWith("/")) url += "/";
  return url + name.split("/").map(encodeURIComponent).join("/");
}

function baseUrl() {
  return location.href.split(/[?#]/)[0];
}

function baseName(url) {
  return decodeURIComponent(url.split("/").filter(v => v.length > 0).slice(-1)[0]);
}

function extName(filename) {
  const dot = filename.lastIndexOf(".");
  if (dot <= 0 || dot === filename.length - 1) return "";
  return filename.substring(dot);
}

function getPathSvg(path_type) {
  switch (path_type) {
    case "Dir": return ICONS.dir;
    case "SymlinkFile": return ICONS.symlinkFile;
    case "SymlinkDir": return ICONS.symlinkDir;
    default: return ICONS.file;
  }
}

function formatMtime(mtime) {
  if (!mtime) return "";
  const d = new Date(mtime);
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDirSize(size) {
  const unit = size === 1 ? "item" : "items";
  const num = size >= MAX_SUBPATHS_COUNT ? `>${MAX_SUBPATHS_COUNT - 1}` : `${size}`;
  return ` ${num} ${unit}`;
}

function formatFileSize(size) {
  if (size == null || size == 0) return [0, "B"];
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const ratio = i >= 3 ? 100 : 1;
  return [Math.round(size * ratio / Math.pow(1024, i)) / ratio, sizes[i]];
}

function formatDuration(seconds) {
  seconds = Math.ceil(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60;
  const pad = (v) => String(v).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatPercent(percent) {
  return percent > 10 ? percent.toFixed(1) + "%" : percent.toFixed(2) + "%";
}

function encodedStr(rawStr) {
  return rawStr.replace(/[\u00A0-\u9999<>\&]/g, i => "&#" + i.charCodeAt(0) + ";");
}

async function assertResOK(res) {
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(await res.text() || `Invalid status ${res.status}`);
  }
}

function getEncoding(contentType) {
  const charset = contentType?.split(";")[1];
  if (/charset/i.test(charset)) {
    const encoding = charset.split("=")[1];
    if (encoding) return encoding.toLowerCase();
  }
  return "utf-8";
}

function decodeBase64(base64String) {
  const binString = atob(base64String);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  const arr = new Uint32Array(bytes.buffer, 0, Math.floor(len / 4));
  let i = 0;
  for (; i < arr.length; i++) {
    arr[i] = binString.charCodeAt(i * 4) |
      (binString.charCodeAt(i * 4 + 1) << 8) |
      (binString.charCodeAt(i * 4 + 2) << 16) |
      (binString.charCodeAt(i * 4 + 3) << 24);
  }
  for (i = i * 4; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}