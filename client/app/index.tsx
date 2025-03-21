import { Email } from "./components/email"
import { EmailsList } from "./components/emails-list"
import { Header } from "./components/header"
import { IEmailResume } from "./interfaces/IEmail"
import { ParsedMail } from "./types/parsed-email"

// ------------------------------------------------------------------------------------------------------------
// -- Theme ---------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
type Theme = 'light' | 'dark'

const __loadThemeFromStorage = (): Theme => {
  let themeStorage = localStorage.getItem('devmail__theme')
  if (themeStorage && ['light', 'dark'].includes(themeStorage as string)) {
    document.documentElement.setAttribute('class', themeStorage)
  } else {
    if (!themeStorage)
      localStorage.setItem('devmail__theme', 'system')

    themeStorage = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    document.documentElement.setAttribute('class', themeStorage)
  }
  return themeStorage as Theme
}

const __theme = __loadThemeFromStorage()
const __mediaSchema = window.matchMedia('(prefers-color-scheme: dark)')
// ------------------------------------------------------------------------------------------------------------


const App = () => {
  const [theme, setTheme] = React.useState<Theme>(__theme)

  const [emails, setEmails] = React.useState<IEmailResume[] | null>(null)
  const [errorEmails, setErrorEmails] = React.useState<string>('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState<ParsedMail | null>(null)
  const [loadingEmail, setLoadingEmail] = React.useState<boolean>(false)
  const [errorEmail, setErrorEmail] = React.useState<string>('')

  const [search, setSearch] = React.useState<string>('')
  const [updating, setUpdating] = React.useState<boolean>(false)

  const __setTheme = (theme: Theme | 'system') => {
    localStorage.setItem('devmail__theme', theme)
    const newTheme = __loadThemeFromStorage()
    setTheme(newTheme)
  }

  const findEmails = React.useCallback(() => {
    fetch(`/api/emails`)
      .then(res => res.json())
      .then(setEmails)
      .catch(() => setErrorEmails('An error occurred while trying to fetch the emails.'))
      .finally(() => setUpdating(false))
  }, [])

  const onSelectHandler = (id: string) => {
    setSelectedId(id)
    setEmails(emails?.map(email => ({ ...email, readed: email.id === id ? true : email.readed })) ?? [])
    setLoadingEmail(true)
    fetch(`/api/emails/${id}`)
      .then(res => res.json())
      .then(setEmail)
      .catch(() => setErrorEmail('An error occurred while trying to fetch the email.'))
      .finally(() => setLoadingEmail(false))
  }

  const onDeleteHandler = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null)
      setEmail(null)
    }
    setEmails(emails => emails?.filter(email => email.id !== id) ?? [])
  }

  const onUpdateHandler = () => {
    setUpdating(true)
    findEmails()
  }

  React.useEffect(() => {
    const storageChange = (e: StorageEvent) => {
      if (e.key === 'devmail__theme') {
        setTheme(t => __loadThemeFromStorage())
        console.log(e.newValue)
      }
    }

    const mediaChange = (e: MediaQueryListEvent) => {
      const storageTheme = localStorage.getItem('devmail__theme') ?? 'system'
      console.log(storageTheme)
      if (storageTheme === 'system' || !['light', 'dark'].includes(storageTheme)) {
        const newTheme = __loadThemeFromStorage()
        setTheme(newTheme)
      }
    }

    window.addEventListener('storage', storageChange)
    __mediaSchema.addEventListener('change', mediaChange)

    return () => {
      window.removeEventListener('storage', storageChange)
      __mediaSchema.removeEventListener('change', mediaChange)
    }
  }, [])

  React.useEffect(() => findEmails(), [findEmails])

  return (
    <div className="flex flex-col bg-background text-foreground">
      <Header
        theme={theme}
        onSet={__setTheme}
      />
      <div className="flex w-full h-[calc(100dvh_-_3rem)]">
        <EmailsList
          emails={emails?.filter(email => new RegExp(search, 'gi').test(email.rcpt) || new RegExp(search, 'gi').test(email.subject)) ?? null}
          error={errorEmails}
          selectedId={selectedId}
          onSelect={onSelectHandler}
          onDelete={onDeleteHandler}
          onDeleteAll={() => {setEmails([]), setEmail(null)}}
          onUpdateClick={onUpdateHandler}
          updating={updating}
          search={search}
          onSearchChange={setSearch}
        />

        <Email email={email} />
      </div>

    </div>
  )
}

window.addEventListener('load', () => {
  const rootDocument = document.querySelector('#root')
  if (rootDocument) {
    // @ts-expect-error
    const root = ReactDOM.createRoot(rootDocument)
    root.render(<App />)
  } else {
    document.body.innerHTML = 'ERROR: Root element not found!<br>Make sure you have a div with id="root" in your index.html file.'
  }
})