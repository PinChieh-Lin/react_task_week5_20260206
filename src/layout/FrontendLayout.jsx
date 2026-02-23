import { Link, Outlet } from "react-router-dom";

function FrontendLayout() {
    return (
        <>
            <header><ul className="nav justify-content-center">
                <li className="nav-item">
                    <Link className="nav-link" to="/">首頁</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/products">產品列表</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/cart">購物車</Link>
                </li>
            </ul></header >
            <main>
                <Outlet />
            </main>
            <footer>
                <p>© 2026 我的網站</p>
            </footer>
        </>
    )
}
export default FrontendLayout;