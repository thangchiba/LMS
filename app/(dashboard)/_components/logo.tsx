import Image from 'next/image'
import Link from 'next/link' // Import Link from next/link

export const Logo = () => {
  return (
    <Link href="/" passHref>
      <Image
        height={115}
        width={500}
        alt="logo"
        src="/ThangChiba-light-500x115.png"
        layout="responsive"
      />
    </Link>
  )
}
