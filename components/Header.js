import Image from "next/image";
import { SearchIcon, MenuIcon, PaperAirplaneIcon, PlusCircleIcon, UserGroupIcon, HeartIcon } from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";

function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useRecoilState(modalState);

    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-50">
            <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">

                <div className="relative hidden lg:inline-grid  w-24 cursor-pointer" onClick={() => router.push('/')}>
                    <Image src="https://links.papareact.com/ocw"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>

                <div className="relative lg:hidden flex-shrink-0 w-10 cursor-pointer" onClick={() => router.push('/')}>
                    <Image src="https://links.papareact.com/jjm"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>

                <div className="hidden lg:inline-flex max-w-xs">
                    <div className="relative mt-1 p-3 rounded-md">
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input type="text" placeholder="Search" className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md" />
                    </div>
                </div>


                <div className="flex items-center justify-end space-x-4">
                    <HomeIcon className="navBtn" onClick={() => router.push('/')} />

                    {session ? (
                        <>
                            <div className="relative navBtn">
                                <PaperAirplaneIcon className="navBtn rotate-45" />
                                <div className="absolute -top-2 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">3</div>
                            </div>

                            <PlusCircleIcon className="navBtn animate-spin" onClick={() => setOpen(true)} />
                            <UserGroupIcon className="navBtn" />
                            <HeartIcon className="navBtn" />

                            <div className="p-4">
                                <div className="group relative">
                                    <button>
                                        <img src={session.user.image} alt="profile pic"
                                            className="h-10 rounded-full cursor-pointer dr" /></button>
                                    <nav tabIndex="0" className=" bg-white invisible w-60 absolute right-0 transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1">
                                        <ul className="py-1">
                                            <li>
                                                <a href="/" className=" px-2 py-2 hover:bg-gray-100" onClick={signOut}>
                                                    Sign Out
                                                    <span className="text-xs px-2">{session.user.email}
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </>
                    ) : (
                        <button onClick={signIn}>Sign In</button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Header;
