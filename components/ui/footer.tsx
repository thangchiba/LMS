import SocialAccounts from '@/components/ui/social-accounts'

export function Footer() {
  return (
    <footer>
      <div className="mb-8 mt-16 items-center justify-center space-y-4 md:mb-10 md:flex md:space-y-0">
        <div className="flex flex-col">
          <div className="my-2 flex justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div>{`Copyright © ${new Date().getFullYear()}`}</div>
            <span>{` • `}</span>
            <span>Hoang Van Thang / ThangChiba</span>
          </div>
          <SocialAccounts />
        </div>
      </div>
    </footer>
  )
}
