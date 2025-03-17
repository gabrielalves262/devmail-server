import { IEmailResume } from "../interfaces/IEmail"
import { clsx } from "../utils"

declare global {
  interface Window {
    moment: any
  }
}

const Loader = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>

const CircleOff = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 20 20" /><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" /><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" /></svg>

const XIcon = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>

const CalendarClock = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h5" /><path d="M17.5 17.5 16 16.3V14" /><circle cx="16" cy="16" r="6" /></svg>

const EmailSearch = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><circle cx="18" cy="18" r="3" /><path d="m22 22-1.5-1.5" /></svg>

interface Props {
  emails: IEmailResume[] | null
  selectedId: string | null
  search: string
  error?: string
  updating: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDeleteAll: () => void
  onUpdateClick: () => void
  onSearchChange: (search: string) => void
}

export const EmailsList = (props: Props) => {
  const {
    emails,
    error,
    selectedId,
    search,
    updating,
    onDelete,
    onSelect,
    onSearchChange,
    onDeleteAll,
    onUpdateClick,
  } = props

  const onDeleteHandler = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    fetch(`/api/emails/${id}`, { method: 'DELETE' })
      .then(() => onDelete?.(id))
      .catch(() => {
        alert('Error deleting email')
      })
  }

  const onDeleteAllHandler = () => {
    fetch('/api/emails', { method: 'DELETE' })
      .then(() => onDeleteAll())
      .catch(() => {
        alert('Error deleting emails')
      })
  }

  return (
    <div className="flex flex-col border-r border-border w-80 max-w-80 min-w-80 bg-muted/40 dark:bg-muted/20 shadow-md">
      <div className="flex items-center w-full border-b border-border p-4 gap-x-2">
        <div className="flex flex-grow relative w-full">
          <input type="search" value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Find email..." className="w-full border border-border h-10 pr-2 pl-10 rounded-radius" />
          <EmailSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-5 h-5" />
        </div>

        <button type="button" onClick={onDeleteAllHandler} title="Delete All" className="flex w-10 h-10 min-w-10 items-center justify-center rounded-radius hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground">
          <span className="sr-only">Delete All</span>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m17 17 4 4" /><path d="m21 17-4 4" /></svg>
        </button>

        <button type="button" onClick={onUpdateClick} disabled={updating} title="Delete All" className="flex w-10 h-10 min-w-10 items-center justify-center rounded-radius hover:bg-muted enabled:cursor-pointer disabled:cursor-not-allowed text-muted-foreground enabled:hover:text-foreground disabled:hover:text-muted-foreground">
          <span className="sr-only">Update</span>
          <svg className={clsx("w-5 h-5", updating && "animate-spin")} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
        </button>

      </div>
      <div className="flex flex-col w-full flex-grow overflow-y-auto scrollbar">
        {emails && !error
          ? emails.length > 0
            ? emails.map(email => (
              <div
                key={email.id}
                onClick={() => onSelect?.(email.id)}
                className={clsx(
                  "relative flex w-full items-center group py-4 pl-4 pr-12 cursor-pointer",
                  "border-b border-border",
                  "border-l-[6px]",
                  email.readed ? "border-l-primary/20" : "border-l-primary",
                  selectedId === email.id ? "bg-primary/10 dark:bg-primary/5" : "hover:bg-muted"
                )}
              >
                <div className="flex flex-grow flex-col">
                  <div className={clsx("font-bold break-all line-clamp-1 w-full text-sm", selectedId === email.id && "text-primary")}>To: {email.rcpt.replace(/(\<[^\>]*\>)/g, '').trim()}</div>
                  <div className="text-ellipsis line-clamp-1 text-sm text-muted-foreground">{email.subject}</div>
                  <div className="text-ellipsis line-clamp-1 text-xs text-muted-foreground mt-1 flex items-center">
                    <CalendarClock className="w-4 h-4 inline-block mr-1" />
                    {window.moment(email.timestamp * 1000).fromNow()}
                  </div>
                </div>
                <div className="absolute right-0 inset-y-0 hidden items-center justify-center min-w-10 group-hover:flex cursor-default z-[1]" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={e => onDeleteHandler(e, email.id)} className="cursor-pointer text-red-500/50 hover:text-red-500 flex items-center justify-center w-6 h-6">
                    <span className="sr-only">Delete</span>
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center px-6 py-6 gap-4">
                <CircleOff className="w-6 h-6 text-muted-foreground" />
                <span className="text-center text-muted-foreground">Your mail box is empty</span>
              </div>
            ) : error
            ? (
              <div className="flex flex-col items-center px-6 py-6 gap-4">
                <CircleOff className="w-6 h-6 text-muted-foreground" />
                <span className="text-center text-muted-foreground">{error}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center px-6 py-6">
                <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
      </div>
    </div>
  )
}