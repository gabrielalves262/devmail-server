import { ParsedMail } from "../types/parsed-email";
import { clsx } from "../utils";

interface Props {
  email: ParsedMail | null
}

// ------------------------------------------------------------------------------------------------------------
// -- Collapsed Email Header ----------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

const __loadCollapsedEmailHeaderFromStorage = (): boolean => {
  let collapsedEmailHeader = localStorage.getItem('devmail__collpased-email-header')
  if (typeof collapsedEmailHeader !== 'string')
    localStorage.setItem('devmail__collpased-email-header', 'false')
  return collapsedEmailHeader?.toLowerCase() === 'true'
}

const __collapsedEmailHeader = __loadCollapsedEmailHeaderFromStorage()
// ------------------------------------------------------------------------------------------------------------

const FileIcon = ({ contentType, className }: { contentType: string } & React.HTMLProps<SVGAElement>) => {
  switch (contentType) {
    // images
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/bmp':
    case 'image/avif':
    case 'image/webp':
    case 'image/tiff':
    case 'image/vnd.microsoft.icon': // Icon
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="12" r="2" /><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" /></svg>

    // videos
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/ogg':
    case 'video/mp2t':
    case 'video/webm':
    case 'video/3gpp':
    case 'video/3gpp2':
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m10 11 5 3-5 3v-6Z" /></svg>

    // audios
    case 'audio/aac':
    case 'audio/midi':
    case 'audio/x-midi':
    case 'audio/mpeg':
    case 'audio/ogg':
    case 'audio/wav':
    case 'audio/webm':
    case 'audio/3gpp':
    case 'audio/3gpp2':
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0" /></svg>

    // codes
    case 'text/html':
    case 'image/svg+xml':
    case 'application/xml':
    case 'application/xhtml+xml':
    case 'application/x-sh':
    case 'application/x-httpd-php':
    case 'application/java-archive':
    case 'text/css':
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m5 12-3 3 3 3" /><path d="m9 18 3-3-3-3" /></svg>

    // JSON
    case 'text/javascript':
    case 'application/ld+json':
    case 'application/json':
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" /><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" /></svg>

    // documents
    case 'text/plain':
    case 'application/rtf':
    case 'application/vnd.oasis.opendocument.text': // OpenDocument Text
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>


    // Compressed files
    case 'application/zip':
    case 'application/x-7z-compressed':
    case 'application/x-zip-compressed':
    case 'application/vnd.rar':
    case 'application/gzip':
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12v-1" /><path d="M10 18v-2" /><path d="M10 7V6" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01" /><circle cx="10" cy="20" r="2" /></svg>

    case 'application/pdf': // PDF

    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // Excel
    case 'application/vnd.ms-excel': // Excel

    case 'text/csv': // CSV

    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': // PowerPoint
    case 'application/vnd.ms-powerpoint': // PowerPoint

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // Word
    case 'application/msword': // Word



    // Installer
    case 'application/vnd.apple.installer+xml': // Apple installer package

    default:
      return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
  }
}

const MailQuestion = ({ className }: React.HTMLProps<HTMLDivElement>) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" /><path d="M20 22v.01" /></svg>

export const Email = ({ email }: Props) => {
  if (!email)
    return <div className="flex flex-grow flex-col items-center justify-center gap-4"><MailQuestion className="text-muted-foreground size-32" />  No email selected</div>

  const [collapsed, setCollapsed] = React.useState(__collapsedEmailHeader)

  const to = Array.isArray(email.to) ? email.to : email.to ? [email.to] : undefined
  const cc = Array.isArray(email.cc) ? email.cc : email.cc ? [email.cc] : undefined
  const bcc = Array.isArray(email.bcc) ? email.bcc : email.bcc ? [email.bcc] : undefined
  const replyTo = Array.isArray(email.replyTo) ? email.replyTo : email.replyTo ? [email.replyTo] : undefined

  const onDownloadClick = (attachment: ParsedMail['attachments'][0]) => {
    const data = Uint8Array.from(attachment.content.data)
    const blob = new Blob([data], { type: attachment.contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.setAttribute('href', url)
    link.setAttribute('download', attachment.filename || 'attachment')
    link.click()
  }

  const onCollapseClick = () => {
    setCollapsed(c => !c)
    localStorage.setItem('devmail__collpased-email-header', (!collapsed).toString())
  }

  React.useEffect(() => {
    const storageChange = (e: StorageEvent) => {
      if (e.key === 'devmail__collpased-email-header') {
        setCollapsed(e.newValue === 'true')
      }
    }

    window.addEventListener('storage', storageChange)
    return () => window.removeEventListener('storage', storageChange)
  }, [])

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      {/* header */}
      <div className="flex flex-col w-full p-4 border-b text-sm relative">
        {collapsed ? (
          <div className="flex w-full items-center gap-x-4">
            <div className={clsx("font-bold", !email.subject && 'text-muted-foreground')}>{email.subject || 'No subject'}</div>
            {email.attachments?.length && (
              <div className="flex items-center gap-x-1">
                <svg className="w-4 h-4 min-w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.234 20.252 21 12.3" /><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" /></svg>
                <span>{email.attachments.length}</span>
              </div>
            )}
          </div>
        ) : (<table className="border-spacing-2 border-separate">
          <tbody>
            <tr>
              <td className="w-px align-top">From:</td>
              <td>
                <div className="flex flex-wrap text-muted-foreground">
                  {email.from?.value.map(from => (
                    <><a href={`mailto:${from.address}`} className="hover:underline hover:text-foreground">{from.name || from.address}</a>;&nbsp;&nbsp;</>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-px align-top">To:</td>
              <td>
                <div className="flex flex-wrap text-muted-foreground">
                  {to?.map(t => t?.value.map(to => (
                    <div><a href={`mailto:${to.address}`} className="hover:underline hover:text-foreground">{to.name || to.address}</a>;&nbsp;&nbsp;</div>
                  )))}
                </div>
              </td>
            </tr>
            {cc && (
              <tr>
                <td className="w-px align-top">CC:</td>
                <td>
                  <div className="flex flex-wrap text-muted-foreground">
                    {cc?.map(t => t?.value.map(cc => (
                      <div><a href={`mailto:${cc.address}`} className="hover:underline hover:text-foreground">{cc.name || cc.address}</a>;&nbsp;&nbsp;</div>
                    )))}
                  </div>
                </td>
              </tr>
            )}
            {bcc && (
              <tr>
                <td className="w-px align-top">BCC:</td>
                <td>
                  <div className="flex flex-wrap text-muted-foreground">
                    {bcc?.map(t => t?.value.map(bcc => (
                      <div><a href={`mailto:${bcc.address}`} className="hover:underline hover:text-foreground">{bcc.name || bcc.address}</a>;&nbsp;&nbsp;</div>
                    )))}
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={99} className="py-1">
                <div className={clsx("font-bold", !email.subject && 'text-muted-foreground')}>{email.subject || 'No subject'}</div>
              </td>
            </tr>
            {email.attachments?.length > 0 && (
              <tr>
                <td colSpan={99} className="">
                  <div className="flex flex-wrap gap-2 items-center">
                    <svg className="w-4 h-4 min-w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.234 20.252 21 12.3" /><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" /></svg>

                    {email.attachments.map(attachment => (
                      <div key={attachment.filename} onClick={() => onDownloadClick(attachment)} className="flex items-center gap-1 text-muted-foreground border rounded-md py-1 px-2 hover:text-foreground cursor-pointer">
                        <FileIcon contentType={attachment.contentType} className="w-4 h-4 min-w-4" />
                        <div>{attachment.filename}</div>
                      </div>
                    ))}

                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}

        <button type="button" onClick={onCollapseClick} className="absolute bottom-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
          <span className="sr-only">Collapse Header</span>
          <svg className={clsx("w-4 h-4 transition-transform", collapsed && 'rotate-180')} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m18 15-6-6-6 6" /></svg>
        </button>
      </div>

      <main className="flex flex-grow w-full overflow-auto scrollbar">
        <iframe className="w-full" srcDoc={email.html || undefined} title={email.subject}></iframe>
      </main>
    </div>
  )
}