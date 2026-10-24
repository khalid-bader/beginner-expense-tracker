const key = 'beginner-expenses-v1';
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const message = document.querySelector('#message');
let expenses = [];
try {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  if (Array.isArray(saved)) expenses = saved.filter(e => e && typeof e.id === 'string' && typeof e.description === 'string' && Number.isSafeInteger(e.halalas) && e.halalas > 0 && e.halalas <= 100000000);
} catch { message.textContent = 'تعذر قراءة البيانات المحفوظة.'; }
function money(value) { return (value / 100).toFixed(2) + ' ر.س'; }
function save() {
  try { localStorage.setItem(key, JSON.stringify(expenses)); }
  catch { message.textContent = 'الحفظ غير متاح؛ البيانات لهذه الجلسة فقط.'; }
}
function render() {
  list.replaceChildren();
  for (const expense of expenses) {
    const li = document.createElement('li'); li.className = 'item';
    const text = document.createElement('span'); text.textContent = expense.description + ' — ' + money(expense.halalas);
    const remove = document.createElement('button'); remove.textContent = 'حذف'; remove.setAttribute('aria-label', 'حذف: ' + expense.description);
    remove.addEventListener('click', () => { expenses = expenses.filter(e => e.id !== expense.id); save(); render(); });
    li.append(text, remove); list.append(li);
  }
  document.querySelector('#total').textContent = money(expenses.reduce((sum, e) => sum + e.halalas, 0));
  document.querySelector('#empty').hidden = expenses.length > 0;
}
form.addEventListener('submit', e => {
  e.preventDefault(); const description = document.querySelector('#description').value.trim();
  const raw = document.querySelector('#amount').value;
  if (!description || !/^\d+(\.\d{1,2})?$/.test(raw)) { message.textContent = 'أدخل وصفًا ومبلغًا بمنزلتين عشريتين كحد أقصى.'; return; }
  // نحفظ هللات صحيحة لتجنب أخطاء جمع الكسور العشرية.
  const [whole, fraction = ''] = raw.split('.');
  const halalas = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(halalas) || halalas <= 0 || halalas > 100000000) { message.textContent = 'أدخل مبلغًا من 0.01 إلى 1,000,000 ريال.'; return; }
  expenses.push({id: Date.now() + '-' + Math.random(), description, halalas});
  message.textContent = 'تمت الإضافة.'; save(); render(); form.reset(); document.querySelector('#description').focus();
});
render();
