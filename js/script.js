// Product data shared across pages
window.products = [
	{id:'bochenbat', title:'Bộ chén bát', price:'199.000₫', imgFile:'bochenbat.jpg', desc:'Bộ chén bát bằng sứ, thiết kế hiện đại, an toàn cho gia đình.'},
	{id:'amdunnuoc', title:'Ấm đun nước', price:'349.000₫', imgFile:'amdunnuoc.jpg', desc:'Ấm đun nước dung tích 1.7L, lõi inox, đun sôi nhanh.'},
	{id:'thamnhatam', title:'Thảm nhà tắm', price:'89.000₫', imgFile:'thamnhatam.png', desc:'Thảm mềm, chống trượt, thấm hút tốt cho phòng tắm.'},
	{id:'giodung', title:'Giỏ đựng đồ', price:'129.000₫', imgFile:'giodungdo.webp', desc:'Giỏ đa năng, tiện cho sắp xếp đồ đạc trong nhà.'},
	{id:'daonhabep', title:'Dao nhà bếp', price:'79.000₫', imgFile:'daonhabep.jpg', desc:'Dao thép không gỉ, sắc bén, an toàn khi sử dụng.'},
	{id:'denban', title:'Đèn bàn', price:'249.000₫', imgFile:'denban.jpg', desc:'Đèn bàn LED tiết kiệm điện, thiết kế tối giản.'},
	{id:'bonoi', title:'Bộ nồi', price:'899.000₫', imgFile:'bôni.webp', desc:'Bộ nồi chống dính, phù hợp cho mọi loại bếp.'},
	{id:'binhgiunhiet', title:'Bình giữ nhiệt', price:'159.000₫', imgFile:'binhgiunhiet.jpg', desc:'Bình giữ nhiệt 500ml giữ nóng/lạnh lâu.'},
	{id:'bokhan', title:'Bộ khăn tắm', price:'279.000₫', imgFile:'bokhantam.jpg', desc:'Bộ khăn tắm mềm mịn, thấm hút tốt.'},
	{id:'giatreo', title:'Giá treo quần áo', price:'199.000₫', imgFile:'giatreoquanao.jpg', desc:'Giá treo gọn gàng, chịu lực ổn định.'},
	{id:'banchai', title:'Bàn chải răng điện', price:'499.000₫', imgFile:'banchaidanhrangdien.jpg', desc:'Bàn chải răng điện, làm sạch sâu, sạc USB.'}
];

// Cart state (persistent in localStorage)
const Cart = (function(){
	const KEY = 'cart_items';
	function load(){
		try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }catch(e){ return {}; }
	}
	function save(obj){ localStorage.setItem(KEY, JSON.stringify(obj)); updateCountUI(); }
	function updateCountUI(){
		const el = document.getElementById('cart-count');
		if(!el) return;
		const items = load();
		const total = Object.values(items).reduce((s,n)=>s+(Number(n)||0),0);
		el.textContent = total;
	}
	function add(productId){
		if(!productId) return;
		const items = load();
		items[productId] = (items[productId] || 0) + 1;
		save(items);
	}
	function remove(productId){
		const items = load();
		if(items[productId]) delete items[productId];
		save(items);
	}
	function clear(){ localStorage.removeItem(KEY); updateCountUI(); }
	function checkout(productId){
		const items = load();
		if(productId){
			if(!items[productId]) return null;
			const qty = items[productId];
			delete items[productId];
			save(items);
			return {id: productId, qty};
		}else{
			const all = Object.assign({}, items);
			clear();
			return all;
		}
	}

	function items(){
		const data = load();
		return Object.keys(data).map(id=>({id, qty: data[id]}));
	}
	document.addEventListener('DOMContentLoaded', updateCountUI);
	return {add, remove, clear, items, updateCountUI, checkout};
})();

function getAssetPath(fileName){
	// If page is inside /html/ folder, images are one level up
	const prefix = location.pathname.includes('/html/') || location.pathname.includes('\\html\\') ? '../assets/thesis/' : 'assets/thesis/';
	return prefix + fileName;
}

window.productUrl = getAssetPath;

function bindAddToCartButtons(root=document){
	const buttons = root.querySelectorAll('.add-to-cart');
	buttons.forEach(btn=>{
		if(btn._bound) return; // avoid double-binding
		btn.addEventListener('click', function(){
			// try to read product id from data-id attribute
			let pid = btn.dataset.id;
			if(!pid){
				// fallback: try to find nearest link with ?id= in href
				const card = btn.closest('.card');
				const a = card && card.querySelector('a[href*="?id="]');
				if(a){
					const m = a.getAttribute('href').match(/[?&]id=([^&]+)/);
					if(m) pid = decodeURIComponent(m[1]);
				}
			}
			Cart.add(pid);
			btn.textContent = 'Đã thêm';
			btn.disabled = true;
		});
		btn._bound = true;
	});
}

function renderProductDetail(id){
	const product = window.products.find(p=>p.id===id);
	if(!product) return;
	const img = document.getElementById('pd-img');
	const title = document.getElementById('pd-title');
	const price = document.getElementById('pd-price');
	const desc = document.getElementById('pd-desc');
	if(img) img.src = getAssetPath(product.imgFile);
	if(title) title.textContent = product.title;
	if(price) price.textContent = product.price;
	if(desc) desc.textContent = product.desc;
	const addBtn = document.getElementById('pd-add');
	if(addBtn){
		addBtn.addEventListener('click', function(){
			Cart.add(id);
			addBtn.textContent = 'Đã thêm'; addBtn.disabled = true;
		});
	}
	const buyBtn = document.getElementById('pd-buy');
	if(buyBtn){
		buyBtn.addEventListener('click', function(){
			Cart.add();
			buyBtn.textContent = 'Đã mua';
			buyBtn.disabled = true;
			const msg = document.getElementById('buy-message');
			if(msg){
				msg.textContent = 'Sản phẩm đã được thêm vào giỏ. Bạn có thể tiếp tục mua hoặc xem giỏ hàng.';
				msg.style.display = 'block';
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function(){
	bindAddToCartButtons(document);
});
