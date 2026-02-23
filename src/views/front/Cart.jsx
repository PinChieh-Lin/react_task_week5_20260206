import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {

    const [cart, setCart] = useState([]);
    const [couponCode, setCouponCode] = useState('');//存儲優惠券代碼的狀態
    const [couponMessage, setCouponMessage] = useState('');//存儲優惠券使用結果訊息的狀態

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
                // console.log(response.data.data);
                setCart(response.data.data);
            } catch (error) {
                console.log(error.response);
            }
        }
        getCart();

    }, [])

    const updateCart = async (cartId, productId, qty = 1) => {
        try {
            const data = {
                product_id: productId,
                qty
            }
            const response = await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, { data })
            console.log(response.data);
            //比較笨的方法重新呼叫getCart來更新購物車資料，因為後端沒有提供更新後回傳整筆購物車資料的API，所以只能這樣做了。
            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(response2.data.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const delCart = async (cartId) => {
        try {

            const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`,)
            console.log(response.data);
            //比較笨的方法重新呼叫getCart來更新購物車資料，因為後端沒有提供更新後回傳整筆購物車資料的API，所以只能這樣做了。
            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(response2.data.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    //清空購物車
    const delAllCart = async () => {
        try {

            const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts/`,)
            console.log(response.data);
            //比較笨的方法重新呼叫getCart來更新購物車資料，因為後端沒有提供更新後回傳整筆購物車資料的API，所以只能這樣做了。
            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(response2.data.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    //使用優惠券
    const applyCoupon = async () => {
        if (!couponCode.trim()) { //檢查優惠券代碼是否為空或僅包含空白字符
            setCouponMessage('請輸入優惠券代碼');
            return;
        }
        try {
            const response = await axios.post(`${API_BASE}/api/${API_PATH}/coupon`, 
                { data: { code: couponCode } });//將優惠券代碼作為請求體的一部分發送到後端
            console.log(response.data);
            setCouponMessage(response.data.message); //將後端返回的訊息顯示給使用者
            // 重新獲取購物車資料以更新總計等資訊
            const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
            setCart(response2.data.data);
        } catch (error) {
            setCouponMessage(error.response?.data?.message || "優惠券代碼無效"); //如果後端返回錯誤訊息，顯示該訊息；否則顯示預設的無效訊息
            console.log(error.response);
        }
    }
    return (
        // src/views/front/Cart.jsx
        <div className="container">
            <h2>購物車列表</h2>
            {/* 優惠券 */}
            <div className="text-end mt-4">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入優惠券代碼"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={applyCoupon}
                    >
                        套用優惠券
                    </button>
                </div>
                {/* 清空購物車 */}
                <button type="button" className="btn btn-outline-danger" onClick={() => delAllCart()}>
                    清空購物車
                </button>
            </div>
            {couponMessage && (
                <div className="alert alert-info mt-2 mb-0">
                    {couponMessage}
                </div>
            )}
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">品名</th>
                        <th scope="col">數量/單位</th>
                        <th scope="col">小計</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cart?.carts?.map(cartItem => (

                            <tr key={cartItem.id}>
                                <td>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => delCart(cartItem.id)}>
                                        刪除
                                    </button>
                                </td>
                                <th scope="row">{cartItem.product.title}</th>
                                <td>
                                    <div className="input-group input-group-sm mb-3">
                                        <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                            defaultValue={cartItem.qty}
                                            onChange={(e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value))}
                                        />
                                        <span className="input-group-text" id="inputGroup-sizing-sm">{cartItem.product.unit}</span>
                                    </div>
                                </td>
                                <td className="text-end">{currency(cartItem.final_total)}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td className="text-end" colSpan="3">
                            總計
                        </td>
                        <td className="text-end">{currency(cart?.final_total)}</td>
                        {/* cart?代表當cart為null或undefined時，不會拋出錯誤 */}
                    </tr>
                </tfoot>
            </table>
        </div>)
}
export default Cart;