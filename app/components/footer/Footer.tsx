import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import {MdFacebook} from "react-icons/md";
import {AiFillTwitterCircle,AiFillInstagram,AiFillYoutube} from "react-icons/ai"

const Footer = () => {
    return ( 
        <footer className="bg-slate-700 text-slate-200 text-sm mt-16">
            <Container>
                <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Shop Categories</h3>
                        <Link href="#">Statuary</Link>
                        <Link href="#">Calacatta</Link>
                        <Link href="#">Crema Marfil</Link>
                        <Link href="#">Emperador</Link>
                        <Link href="#">Carrara</Link>
                    </FooterList>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Customer Services</h3>
                        <Link href="#">Contact Us</Link>
                        <Link href="#">Shipping Policy</Link>
                        <Link href="#">Guaranted</Link>
                        <Link href="#">Return & Exchange</Link>
                        <Link href="#">FAQs</Link>
                    </FooterList>
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-base font-bold mb-2">About Us</h3>
                        <p className="mb-2">At our marbles & tiles store, we are dedicated
                        to providing the latest and newest marbles for ground and home decoration uses we have beautifull design and finicing tiles.
                        </p>
                        <p>&copy; {new Date().getFullYear()} Taj~Marbles. All rights reserved</p>
                    </div>
                    <FooterList>
                        <h3 className="text-base font-bold mb-2">Follow Us</h3>
                        <div className="flex gap-2">
                            <Link href="https://www.facebook.com/shivbhan.kushwaha.75" target="blank"><MdFacebook size={24}/></Link>
                            <Link href="https://twitter.com/technical_jugad" target="blank"><AiFillTwitterCircle size={24}/></Link>
                            <Link href="https://www.instagram.com/black_lover14444/" target="blank"><AiFillInstagram size={24}/></Link>
                            <Link href="https://www.youtube.com/c/chaoocharles" target="blank"><AiFillYoutube size={24}/></Link>
                        </div>
                    </FooterList>
                </div>
            </Container>
        </footer>
     );
}
 
export default Footer;