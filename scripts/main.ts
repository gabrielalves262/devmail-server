const openListIcon = {
  open: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>`,
  close: `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>`,
}

const contentTypeIcon: { [key: string]: string } = {
  default: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  "application/zip": `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-archive"><path d="M10 12v-1"/><path d="M10 18v-2"/><path d="M10 7V6"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01"/><circle cx="10" cy="20" r="2"/></svg>`,
  "application/json": `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-2"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>`,
  "application/xml": `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-2"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>`,
  "text/plain": `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  "application/pdf": ``,
}

let buttonOpenList: HTMLButtonElement | null
let buttonReload: HTMLButtonElement | null
let list: HTMLDivElement | null

const intervalReloadEmailMS = 30000;
let intervalReloadEmails: NodeJS.Timeout | undefined;

type EmailResume = {
  id: string;
  rcpt: string;
  subject: string;
  timestamp: number;
  readed: boolean;
}

type State = {
  selectedEmail: string | null;
  loadingEmails: boolean;
  emails: EmailResume[] | null;
  email: (EmailResume & { content: string }) | null;
}

const state: State = {
  selectedEmail: null,
  email: null,
  emails: null,
  loadingEmails: true,
}

const downloadAttachment = (filename: string, content: Buffer, contentType: string) => {
  const data = Uint8Array.from(content);
  const blob = new Blob([data], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
}

const convertBytesSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' ' + sizes[i];
}

const EmailHeader = (data: any): HTMLDivElement => {
  const header = document.createElement('div');
  header.classList.add('flex', 'flex-col', 'gap-y-2', 'p-4', 'border-b', 'border-gray-200', 'text-sm', '[&>table>tbody>tr>td]:px-2', '[&_a]:text-sky-500', '[&_a]:hover:underline');
  header.innerHTML = `
    <table>
      <tbody>
        <tr>
          <td width="1" class="font-bold">From:</td>
          <td>${data.from.html}</td>
        </tr>
        <tr>
          <td width="1" class="font-bold">To:</td>
          <td>${data.to.html}</td>
        </tr>
        <tr>
          <td colspan="2" class="h-5"></td>
        </tr>
        <tr>
          <td colspan="2" class="font-bold">${data.subject}</td>
      </tbody>
    </table>
  `

  if (data.attachments?.length > 0) {
    header.innerHTML += `</hr>`

    const attachmentsDiv = document.createElement('div');
    attachmentsDiv.classList.add('flex', 'flex-wrap', 'gap-2', 'px-2', 'items-center');
    attachmentsDiv.innerHTML = `<svg class="text-gray-600 w-4 h-4 min-w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/></svg>`

    data.attachments.forEach((at: any) => {
      const attachmentBtn = document.createElement('button');
      attachmentBtn.classList.add('px-2', 'py-1', 'border', 'border-gray-200', 'rounded-md', 'flex', 'items-center', 'gap-2', 'cursor-pointer', 'hover:bg-gray-100');
      attachmentBtn.innerHTML = `
        ${contentTypeIcon[at.contentType] || contentTypeIcon.default}
        <div class="text-sm">${at.filename}</div>
      `

      attachmentBtn.addEventListener('click', () => downloadAttachment(at.filename, at.content.data, at.contentType))
      attachmentsDiv.appendChild(attachmentBtn);
    })

    header.appendChild(attachmentsDiv);
  }

  return header;
}

const removeEmail = async (el: HTMLElement) => {
  if (!el.parentElement?.parentElement) return;

  fetch(`/api/emails/${el.getAttribute('data-id')}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      if (state.selectedEmail === el.getAttribute('data-id')) {
        document.querySelector('main')!.innerHTML = ''
        document.querySelectorAll('.email-list-item').forEach(item => item.classList.remove('selected'));
      }
      el.parentElement!.parentElement!.remove()
    })
    .catch(() => {
      // TODO: Show error
    })
}

const setSelected = async (el: HTMLElement) => {
  if (!el.parentElement) return;
  if (state.selectedEmail === el.parentElement.id) return;

  state.selectedEmail = el.parentElement.id;
  document.querySelectorAll('.email-list-item').forEach(item => item.classList.remove('selected'));
  el.parentElement.classList.add('selected');
  el.parentElement.setAttribute('data-readed', 'true');
  fetch(`/api/emails/${state.selectedEmail}`)
    .then(res => res.json())
    .then(data => {
      state.email = data;
      console.log(data)
      document.querySelector('main')!.innerHTML = ''
      document.querySelector('main')!.appendChild(EmailHeader(data))

      const html = document.createElement('div');
      html.classList.add('flex', 'flex-col', 'gap-y-2', 'p-4', 'text-sm', 'overflow-auto');
      html.innerHTML = data.html;

      document.querySelector('main')!.appendChild(html);
    })
    .catch(() => {
      // TODO: Show error
    })
}

const getAllEmails = async () => {
  if (buttonReload) {
    document.querySelector(`#${buttonReload.id}>svg`)?.classList.add('animate-spin');
    buttonReload.disabled = true;
  }
  fetch('/api/emails')
    .then(res => res.json())
    .then(data => {
      if (JSON.stringify(state.emails) == JSON.stringify(data)) return;
      state.emails = data as EmailResume[];
      const listItems = document.querySelector('#list-items');
      if (listItems) {
        if (state.emails.length === 0) {
          listItems.innerHTML = `<div class="text-center text-sm text-gray-500 px-4 py-10">No emails</div>`;
        } else {
          listItems.innerHTML = state.emails.map(email => `<div id="${email.id}" data-readed="${email.readed ? 'true' : 'false'}" class="flex gap-x-2 p-2 group email-list-item ${email.id === state.selectedEmail && "selected"}">
  <div class="flex flex-col flex-grow cursor-pointer" onclick="setSelected(this)">
    <div class="overflow-hidden text-ellipsis line-clamp-1 text-sm">To: ${email.rcpt}</div>
    <div class="text-xs text-gray-500">${email.subject}</div>
    <div class="text-xs text-gray-500">${new Date(email.timestamp * 1000).toLocaleString()}</div>
  </div>
  <div class="flex items-center justify-center w-6">
    <button type="button" class="text-red-300 hover:text-red-500 hidden group-hover:block cursor-pointer" data-id="${email.id}" onclick="removeEmail(this)">
      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
    </button>
  </div>
</div>`)
            .join('\r\n');
        }
      }
    })
    .catch(() => {
      // TODO: Show error
    })
    .finally(async () => {
      // TODO: Remove loading
      if (buttonReload) {
        document.querySelector(`#${buttonReload.id}>svg`)?.classList.remove('animate-spin');
        buttonReload.disabled = false;
      }
    })
}

window.addEventListener('load', async () => {
  let openList = localStorage.getItem('devmail__open-list') === 'true';

  buttonOpenList = document.querySelector('#button__open-list');
  buttonReload = document.querySelector('#button__reload');
  list = document.querySelector('#list');

  !openList && list?.classList.add('hidden');

  if (buttonOpenList) {
    buttonOpenList.innerHTML = openList ? openListIcon.close : openListIcon.open;
    buttonOpenList.addEventListener('click', function () {
      openList = !openList;
      localStorage.setItem('devmail__open-list', openList ? 'true' : 'false');
      this.innerHTML = openList ? openListIcon.close : openListIcon.open;
      openList
        ? list?.classList.remove('hidden')
        : list?.classList.add('hidden');
    })
  }

  if (buttonReload) {
    buttonReload.addEventListener('click', async () => {
      clearInterval(intervalReloadEmails)
      await getAllEmails();
      intervalReloadEmails = setInterval(getAllEmails, intervalReloadEmailMS);
    })
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  document.querySelector('#loading')?.remove();

  await getAllEmails()
  intervalReloadEmails = setInterval(getAllEmails, intervalReloadEmailMS);
});
