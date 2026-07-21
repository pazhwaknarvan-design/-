/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  FileText, 
  Activity, 
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database,
  CloudLightning,
  User,
  Users,
  Award,
  AlertTriangle,
  ShoppingBag,
  ListTodo,
  Coins,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Plus,
  Send,
  Eye,
  CheckCircle,
  Truck,
  Heart,
  Sparkles,
  Info,
  ChevronDown,
  Lock,
  Unlock,
  Mail,
  Phone,
  Check,
  Copy,
  FileSignature,
  Link
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DriveFile, Language, SpreadsheetData } from '../types';
import { translations } from '../utils/translations';
import KaraLogo from './KaraLogo';

interface DashboardProps {
  files: DriveFile[];
  sheetData: SpreadsheetData | null;
  lang: Language;
  onRefresh: () => void;
  loading: boolean;
  onSelectTab: (tab: 'drive' | 'sheets') => void;
  onAddTransaction?: (rowValues: any[]) => Promise<void>;
}

// Local interface for Brands representation
interface BrandPartner {
  id: string;
  name: string;
  enName: string;
  owner: string;
  category: string;
  enCategory: string;
  capital: number;
  capitalTier: 'Starter' | 'Growth' | 'Premium';
  score: number;
  tier: 'Nova' | 'Standard' | 'Mumtaz' | 'Golden' | 'Diamond';
  enTier: string;
  risk: 'Low' | 'Medium' | 'High';
  errorRate: number;
  refundRate: number;
  joinedDate: string;
  warningsCount: number;
  salesCount: number;
  email?: string;
  phone?: string;
  activitySpecs?: string;
  contractStatus?: 'draft' | 'ceo_signed' | 'fully_signed';
  contractText?: string;
  accessLink?: string;
}

// Local interface for interactive products representing top 100 products from PDF
interface ProductSKU {
  id: string;
  name: string;
  enName: string;
  priceBuy: number;
  priceSell: number;
  stock: number;
  image: string;
  category: string;
}

export default function Dashboard({
  files,
  sheetData,
  lang,
  onRefresh,
  loading,
  onSelectTab,
  onAddTransaction,
}: DashboardProps) {
  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Perspectives switcher state:
  // 'ceo' -> KARA Admin / Top Leadership
  // 'ops' -> KARA Operations Team
  // 'brand' -> Partner Brand panel
  // 'customer' -> End customer portal
  const [activeRole, setActiveRole] = useState<'ceo' | 'ops' | 'brand' | 'customer'>('ceo');

  // SELECTED BRAND FOR FOUNDER PERSPECTIVE
  const [selectedFounderBrandId, setSelectedFounderBrandId] = useState<string>('luna');

  // INTERACTIVE BRAND PARTNERS SEED DATA (REPRESENTING THE 200 BRANDS IN THE ECOSYSTEM)
  const [brands, setBrands] = useState<BrandPartner[]>([
    {
      id: 'luna',
      name: 'برند آرایشی و مراقبت پوست لونا',
      enName: 'Luna Skincare & Beauty',
      owner: 'فریبا محمدی (Fariba Mohammadi)',
      category: 'مراقبت پوست',
      enCategory: 'Skincare & Cosmetics',
      capital: 3200,
      capitalTier: 'Growth',
      score: 94,
      tier: 'Golden',
      enTier: 'Golden',
      risk: 'Low',
      errorRate: 1.2,
      refundRate: 0.8,
      joinedDate: '1404/02/15',
      warningsCount: 0,
      salesCount: 142,
      email: 'fariba@luna.com',
      phone: '09121112233',
      activitySpecs: 'تولید لوازم مراقبت پوست گیاهی، سرم‌های بهداشتی آبرسان و لوسیون‌های معطر ارگانیک تحت نظارت کیفی کارا.',
      contractStatus: 'fully_signed',
      contractText: 'این قرارداد فی‌مابین هلدینگ زنجیره‌ای کارا (مدیریت ارشد) و برند آرایشی لونا به مالکیت خانم فریبا محمدی جهت همکاری تجاری منعقد می‌گردد. طرفین متعهد به عرضه کالاهای بهداشتی با اصالت تضمین‌شده، رعایت حریم خصوصی موضوع ماده ۵ آیین‌نامه و تداوم شارژ انبار مرکزی طبق برآورد دوره‌ای می‌باشند.',
      accessLink: 'luna-special-token'
    },
    {
      id: 'delara',
      name: 'عطر زنانه لوکس دلآرا',
      enName: 'Delara Luxury Perfumes',
      owner: 'زهرا محسنی (Zahra Mohseni)',
      category: 'عطر و ادکلن',
      enCategory: 'Perfumes',
      capital: 4500,
      capitalTier: 'Growth',
      score: 91,
      tier: 'Golden',
      enTier: 'Golden',
      risk: 'Low',
      errorRate: 1.5,
      refundRate: 1.1,
      joinedDate: '1404/05/10',
      warningsCount: 0,
      salesCount: 98,
      email: 'zahra@delara.com',
      phone: '09122223344',
      activitySpecs: 'طراحی، اسانس‌گیری و عرضه عطرهای لوکس بر پایه رایحه گل رز هرات، یاسمن کوهی و مشک مرغوب طبیعی.',
      contractStatus: 'fully_signed',
      contractText: 'این قرارداد فی‌مابین هلدینگ زنجیره‌ای کارا و برند عطر دلآرا به مالکیت خانم زهرا محسنی با میزان سرمایه ۴۵۰۰ دلار منعقد می‌گردد. تامین‌کننده متعهد به رعایت بالاترین پایداری کیفیت شیشه‌ها و اسانس‌های وارداتی از دبی و ترکیه و همخوانی با آیین‌نامه ترخیص کالا می‌باشد.',
      accessLink: 'delara-special-token'
    },
    {
      id: 'karwan',
      name: 'چرم و اکسسوری چرمی کاروان',
      enName: 'Karwan Leather Accessories',
      owner: 'ناهید رضایی (Nahid Rezaei)',
      category: 'اکسسوری',
      enCategory: 'Accessories',
      capital: 2800,
      capitalTier: 'Starter',
      score: 85,
      tier: 'Mumtaz',
      enTier: 'Excellent (Mumtaz)',
      risk: 'Low',
      errorRate: 2.1,
      refundRate: 1.8,
      joinedDate: '1404/08/22',
      warningsCount: 0,
      salesCount: 64,
      email: 'nahid@karwan.com',
      phone: '09123334455',
      activitySpecs: 'تولید محصولات چرمی نفیس شامل کیف دستی کلاچ، کمربند، جاکلیدی چرمی و صندل‌های تمام چرم سنتی دست‌دوز.',
      contractStatus: 'ceo_signed',
      contractText: 'پیش‌نویس قرارداد فی‌مابین هلدینگ کارا و برند چرم کاروان به مالکیت خانم ناهید رضایی با سرمایه ۲۸۰۰ دلار. این قرارداد به تایید و امضای مدیریت ارشد کارا رسیده و جهت شروع به کار در انتظار امضای دیجیتال مالک برند می‌باشد.',
      accessLink: 'karwan-special-token'
    },
    {
      id: 'kara_box',
      name: 'باکس هدیه و کادویی کارا',
      enName: 'KARA Luxury Gift Boxes',
      owner: 'مریم احمدی (Maryam Ahmadi)',
      category: 'باکس هدیه',
      enCategory: 'Gift Box Sets',
      capital: 1900,
      capitalTier: 'Starter',
      score: 88,
      tier: 'Mumtaz',
      enTier: 'Excellent (Mumtaz)',
      risk: 'Low',
      errorRate: 1.8,
      refundRate: 0.5,
      joinedDate: '1404/11/05',
      warningsCount: 0,
      salesCount: 78
    },
    {
      id: 'anahita',
      name: 'شال و حجاب آناهیتا',
      enName: 'Anahita Modern Hijab',
      owner: 'راحله کریمی (Rahela Karimi)',
      category: 'شال و روسری',
      enCategory: 'Scarves & Hijab',
      capital: 2100,
      capitalTier: 'Starter',
      score: 72,
      tier: 'Standard',
      enTier: 'Standard',
      risk: 'Medium',
      errorRate: 3.4,
      refundRate: 2.9,
      joinedDate: '1404/12/18',
      warningsCount: 0,
      salesCount: 42
    },
    {
      id: 'kara_decor',
      name: 'شمع و اکسسوری منزل کارا',
      enName: 'KARA Home Decor & Candles',
      owner: 'عاطفه جوادی (Atefeh Javadi)',
      category: 'لوازم خانه',
      enCategory: 'Home Decor',
      capital: 5200,
      capitalTier: 'Growth',
      score: 68,
      tier: 'Standard',
      enTier: 'Standard',
      risk: 'Medium',
      errorRate: 4.2,
      refundRate: 3.5,
      joinedDate: '1405/01/10',
      warningsCount: 1,
      salesCount: 31
    },
    {
      id: 'zarbaft',
      name: 'صنایع دستی و لباس سنتی زربفت',
      enName: 'Zarbaft Afghan Handicrafts',
      owner: 'فرشته نظری (Fereshteh Nazari)',
      category: 'صنایع دستی',
      enCategory: 'Handicrafts',
      capital: 1200,
      capitalTier: 'Starter',
      score: 86,
      tier: 'Mumtaz',
      enTier: 'Excellent (Mumtaz)',
      risk: 'Low',
      errorRate: 1.5,
      refundRate: 0.4,
      joinedDate: '1404/04/12',
      warningsCount: 0,
      salesCount: 112
    },
    {
      id: 'ghazal',
      name: 'پوشاک کودک و نوزاد غزل',
      enName: 'Ghazal Kids & Mom',
      owner: 'مژگان رسولی (Mojgan Rasouli)',
      category: 'مادر و کودک',
      enCategory: 'Baby & Mom',
      capital: 3500,
      capitalTier: 'Growth',
      score: 61,
      tier: 'Standard',
      enTier: 'Standard',
      risk: 'Medium',
      errorRate: 5.4,
      refundRate: 4.8,
      joinedDate: '1405/02/01',
      warningsCount: 1,
      salesCount: 18
    },
    {
      id: 'setareh',
      name: 'محصولات پوست ستاره (نوپا)',
      enName: 'Setareh Cleansers & Serums',
      owner: 'ستاره رحیمی (Setareh Rahimi)',
      category: 'مراقبت پوست',
      enCategory: 'Skincare',
      capital: 1500,
      capitalTier: 'Starter',
      score: 54,
      tier: 'Nova',
      enTier: 'Nova (Young Brand)',
      risk: 'High',
      errorRate: 7.2,
      refundRate: 6.8,
      joinedDate: '1405/03/15',
      warningsCount: 2,
      salesCount: 12
    },
    {
      id: 'aria_fashion',
      name: 'پوشاک مجلسی آریا افغان',
      enName: 'Aria Formal & Gown wear',
      owner: 'نفیسه کریمی (Nafiseh Karimi)',
      category: 'لباس مجلسی',
      enCategory: 'Formal Dresses',
      capital: 7800,
      capitalTier: 'Premium',
      score: 58,
      tier: 'Nova',
      enTier: 'Nova (Young Brand)',
      risk: 'High',
      errorRate: 8.5,
      refundRate: 9.2,
      joinedDate: '1405/03/20',
      warningsCount: 2,
      salesCount: 8
    }
  ]);

  // SUPPLIER SECURITY RULES & RATING CARD (FROM PAGE 98 OF PDF)
  const suppliers = [
    { name: 'امارات (Dubai, UAE)', enName: 'Dubai UAE (Elite)', score: 94, quality: 5, price: 2, delivery: 'Very Fast', stability: '99%' },
    { name: 'ترکیه (Istanbul, TR)', enName: 'Turkey (Premium)', score: 92, quality: 5, price: 3, delivery: 'Fast', stability: '95%' },
    { name: 'چین (Guangzhou, CN)', enName: 'China (Mass-Volume)', score: 88, quality: 4, price: 5, delivery: 'Slow (30 days)', stability: '90%' },
    { name: 'افغانستان (Kabul Local)', enName: 'Afghanistan Local Handmades', score: 84, quality: 4, price: 3, delivery: 'Instant', stability: '75%' },
    { name: 'ایران (Tehran, IR)', enName: 'Iran Suppliers', score: 78, quality: 3, price: 4, delivery: 'Fast', stability: '80%' },
    { name: 'پاکستان (Lahore, PK)', enName: 'Pakistan Goods', score: 76, quality: 3, price: 4, delivery: 'Fast', stability: '85%' },
  ];

  // INTERACTIVE CHECKLIST FOR EXECUTION TEAM (PAGE 103 OF PDF)
  const [checklist, setChecklist] = useState([
    // Morning Checklist
    { id: 'chk_1', text: 'بررسی و تایید سفارش‌های واریز شده مشتریان', section: 'morning', done: true },
    { id: 'chk_2', text: 'بررسی پیام‌های تلگرام/واتساپ صاحبان برند و راهنمایی', section: 'morning', done: false },
    { id: 'chk_3', text: 'کنترل موجودی کالاهای پرفروش و هشدار اتمام موجودی', section: 'morning', done: true },
    { id: 'chk_4', text: 'بررسی و انطباق واریزی‌های بانکی با رسیدها', section: 'morning', done: false },
    // Afternoon Checklist
    { id: 'chk_5', text: 'بررسی راندمان کمپین‌های فعال اینستاگرام و فیسبوک', section: 'afternoon', done: false },
    { id: 'chk_6', text: 'کنترل کیفیت بصری و اصالت محصولات طراحی شده', section: 'afternoon', done: true },
    { id: 'chk_7', text: 'تحلیل داده‌های آماری رشد هر برند و تهیه پیشنهادات', section: 'afternoon', done: false },
    // Evening Checklist
    { id: 'chk_8', text: 'بررسی عملکرد روزانه فروش و ثبت نهایی لجر مالی', section: 'evening', done: false },
    { id: 'chk_9', text: 'بررسی و حل مشکلات شکایات مشتریان و تیکت‌ها', section: 'evening', done: true }
  ]);

  // BRAND PRODUCTS (SKU DATABASE FROM PAGE 77-84 OF THE PDF)
  const [products, setProducts] = useState<Record<string, ProductSKU[]>>({
    luna: [
      { id: 'p_l_1', name: '۱. ضدآفتاب لونا پلاس', enName: 'Luna Premium Sunscreen', priceBuy: 450000, priceSell: 850000, stock: 12, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60', category: 'مراقبت پوست' },
      { id: 'p_l_2', name: '۲. سرم ویتامین C روشن‌کننده', enName: 'Vitamin C Brightening Serum', priceBuy: 520000, priceSell: 980000, stock: 4, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=60', category: 'مراقبت پوست' },
      { id: 'p_l_3', name: '۳. مرطوب‌کننده فوق‌العاده', enName: 'Deep Moisturizing Cream', priceBuy: 300000, priceSell: 620000, stock: 18, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&auto=format&fit=crop&q=60', category: 'مراقبت پوست' },
      { id: 'p_l_4', name: '۴. شوینده صورت آلوئه‌ورا', enName: 'Gentle Aloe Cleansing Gel', priceBuy: 250000, priceSell: 520000, stock: 0, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=60', category: 'مراقبت پوست' }, // Out of stock!
      { id: 'p_l_5', name: '۵. ماسک لایه‌بردار خاک رس', enName: 'Purifying Charcoal Mud Mask', priceBuy: 350000, priceSell: 750000, stock: 9, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60', category: 'مراقبت پوست' }
    ],
    delara: [
      { id: 'p_d_1', name: '۱۱. عطر جیبی مینی دلآرا', enName: 'Delara Pocket Scent', priceBuy: 200000, priceSell: 450000, stock: 15, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=60', category: 'عطر و ادکلن' },
      { id: 'p_d_2', name: '۱۲. عطر عربی مشک و رز', enName: 'Arabian Rose & Musk Oud', priceBuy: 650000, priceSell: 1450000, stock: 8, image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=150&auto=format&fit=crop&q=60', category: 'عطر و ادکلن' },
      { id: 'p_d_3', name: '۱۳. بادی اسپلش درخشان دبی', enName: 'Shimmering Dubai Body Splash', priceBuy: 300000, priceSell: 680000, stock: 24, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=150&auto=format&fit=crop&q=60', category: 'عطر و ادکلن' },
      { id: 'p_d_4', name: '۱۴. عطر مو معطر دلآرا', enName: 'Delara Sweet Jasmine Hair Mist', priceBuy: 280000, priceSell: 600000, stock: 3, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=150&auto=format&fit=crop&q=60', category: 'عطر و ادکلن' }
    ],
    zarbaft: [
      { id: 'p_z_1', name: 'صنایع‌دستی: لباس سنتی دست‌دوز افغان', enName: 'Traditional Hand-embroidered Dress', priceBuy: 1500000, priceSell: 3800000, stock: 2, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=60', category: 'صنایع دستی' },
      { id: 'p_z_2', name: 'صنایع‌دستی: کوسن گل‌دوزی غزنوی', enName: 'Embroidered Ghaznavi Cushion Cover', priceBuy: 400000, priceSell: 950000, stock: 6, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150&auto=format&fit=crop&q=60', category: 'صنایع دستی' }
    ],
    karwan: [
      { id: 'p_k_1', name: '۱۶. کیف کلاچ مجلسی چرم', enName: 'Premium Leather Party Clutch', priceBuy: 450000, priceSell: 1100000, stock: 5, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60', category: 'اکسسوری' },
      { id: 'p_k_2', name: '۱۷. کیف دوشی روزانه چرم', enName: 'Handcrafted Daily Leather Tote', priceBuy: 800000, priceSell: 1950000, stock: 1, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=150&auto=format&fit=crop&q=60', category: 'اکسسوری' },
      { id: 'p_k_3', name: '۱۸. کیف آرایش چرم مسافرتی', enName: 'Compact Travel Makeup Case', priceBuy: 220000, priceSell: 480000, stock: 12, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=60', category: 'اکسسوری' }
    ]
  });

  // CUSTOMER INTERACTIVE PURCHASE STATES & HISTORY
  const [orders, setOrders] = useState([
    { id: 'TXN-1001', customerName: 'منیژه رحیمی', brandName: 'برند لونا', amount: 850000, item: 'ضدآفتاب لونا پلاس', status: 'delivered', date: '۱۴۰۵/۰۴/۱۸' },
    { id: 'TXN-1002', customerName: 'مریم سادات', brandName: 'عطر دلآرا', amount: 1450000, item: 'عطر عربی مشک و رز', status: 'preparing', date: '۱۴۰۵/۰۴/۱۹' },
    { id: 'TXN-1003', customerName: 'لیلا کابلی', brandName: 'صنایع‌دستی زربفت', amount: 3800000, item: 'لباس سنتی دست‌دوز افغان', status: 'paid', date: '۱۴۰۵/۰۴/۱۹' }
  ]);

  const [customerTickets, setCustomerTickets] = useState([
    { id: 'TKT-701', customer: 'سمیرا پکتیا', subject: 'سوال درباره ضمانت اصالت کرم لونا', status: 'resolved', reply: 'تمامی کرم‌ها با ضمانت بازگشت و فاکتور رسمی تامین‌کننده امارات عرضه می‌شوند.' },
    { id: 'TKT-702', customer: 'شریفه امیری', subject: 'تاخیر در پیک لباس سنتی زربفت', status: 'pending', reply: '' }
  ]);

  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [selectedBrandForShopping, setSelectedBrandForShopping] = useState<string>('luna');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  // SEARCH AND FILTER IN BRANDS DIRECTORY (FOR THE 200 BRAND MANAGEMENT)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [capitalFilter, setCapitalFilter] = useState('All');

  // CUSTOMER LOYALTY POINTS STATE
  const [customerPoints, setCustomerPoints] = useState<number>(1200);

  // TEAM SUB-DEPARTMENTS TAB STATE (branding, supervision, finance)
  const [opsSubTab, setOpsSubTab] = useState<'branding' | 'supervision' | 'finance'>('branding');

  // BRANDING NEW PRODUCT REGISTRATION STATES
  const [regBrandId, setRegBrandId] = useState<string>('luna');
  const [regName, setRegName] = useState<string>('');
  const [regEnName, setRegEnName] = useState<string>('');
  const [regCategory, setRegCategory] = useState<string>('مراقبت پوست');
  const [regPriceBuy, setRegPriceBuy] = useState<number>(300000);
  const [regPriceSell, setRegPriceSell] = useState<number>(750000);
  const [regStock, setRegStock] = useState<number>(10);
  const [regDesc, setRegDesc] = useState<string>('');
  const [regSpecsColor, setRegSpecsColor] = useState<string>('استاندارد');
  const [regSpecsSize, setRegSpecsSize] = useState<string>('متوسط');
  const [regImage, setRegImage] = useState<string>('');

  // CEO SUB-TABS STATE
  const [ceoSubTab, setCeoSubTab] = useState<'overview' | 'contracts' | 'employees'>('overview');

  // EMPLOYEES REGISTRY STATE
  const [employees, setEmployees] = useState([
    {
      id: 'emp_1',
      name: 'احمد کریمی (Ahmad Karimi)',
      email: 'ahmad@kara.com',
      phone: '09129998877',
      department: 'branding',
      salary: 150000000,
      workingHours: 44,
      duration: '12 ماه',
      status: 'approved',
      accessLink: 'link-emp-ahmad-3281'
    },
    {
      id: 'emp_2',
      name: 'زهرا علیزاده (Zahra Alizadeh)',
      email: 'zahra@kara.com',
      phone: '09127776655',
      department: 'supervision',
      salary: 160000000,
      workingHours: 40,
      duration: '6 ماه',
      status: 'pending_approval',
      accessLink: ''
    }
  ]);

  // BUSINESS SESSION STATES (For secure role gates, starts pre-loaded for demo review)
  const [ceoSession, setCeoSession] = useState<boolean>(true);
  const [activeBrandSession, setActiveBrandSession] = useState<string | null>('luna');
  const [activeEmployeeSession, setActiveEmployeeSession] = useState<string | null>('emp_1');

  // BRAND REGISTRATION FORM INPUTS
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandEnName, setNewBrandEnName] = useState('');
  const [newBrandOwner, setNewBrandOwner] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('مراقبت پوست');
  const [newBrandSpecs, setNewBrandSpecs] = useState('');
  const [newBrandCapital, setNewBrandCapital] = useState(3000);
  const [newBrandEmail, setNewBrandEmail] = useState('');
  const [newBrandPhone, setNewBrandPhone] = useState('');

  // CONTRACT SIGNING SELECTOR
  const [selectedContractBrandId, setSelectedContractBrandId] = useState('karwan');

  // EMPLOYEE REGISTRATION FORM INPUTS
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpDept, setNewEmpDept] = useState<'branding' | 'supervision' | 'finance'>('branding');
  const [newEmpSalary, setNewEmpSalary] = useState(150000000);
  const [newEmpHours, setNewEmpHours] = useState(44);

  // AUTHENTICATION PORTAL LOCAL INPUTS
  const [loginCredential, setLoginCredential] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  // TOP CUSTOMER REWARD COMPETITION LEADERBOARD
  const topCustomers = useMemo(() => [
    { name: 'منیژه رحیمی (Manizha Rahimi)', points: 1950, prize: 'باکس هدیه لوکس زعفران کارا (KARA Luxury Saffron Set)' },
    { name: 'مریم سادات (Maryam Sadat)', points: 1650, prize: 'شال گلدوزی دستی ابریشم (Handmade Silk Embroidered Scarf)' },
    { name: 'لیلا کابلی (Layla Kaboli)', points: 1350, prize: 'ست عطر جیبی مینی دلآرا (Delara Pocket Scent Trio)' },
    { name: 'نرگس جلالی (Nargis Jalali)', points: 900, prize: 'کرم آبرسان عمیق لونا (Luna Hydration Kit)' }
  ], []);

  const customerLeaderboard = useMemo(() => {
    const list = [
      ...topCustomers,
      { name: lang === 'fa' ? 'شما (حساب کاربری فعال)' : 'You (Active Account)', points: customerPoints, prize: 'هدایای ویژه سطح وفاداری کارا (KARA Elite Level Gifts)', isMe: true }
    ];
    return list.sort((a, b) => b.points - a.points);
  }, [customerPoints, topCustomers, lang]);

  // BRAND PERFORMANCE & COMPETITION LEADERBOARD
  const brandLeaderboard = useMemo(() => {
    return [...brands].sort((a, b) => b.score - a.score);
  }, [brands]);

  // REGISTER NEW SKU PRODUCT HANDLER FOR OPERATIONS BRANDING DEPARTMENT
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert(lang === 'fa' ? 'لطفا نام کالا را وارد کنید.' : 'Please enter product name.');
      return;
    }

    const newSkuId = `p_u_${Date.now().toString().slice(-4)}`;
    const fallbackImage = regCategory === 'عطر و ادکلن' 
      ? 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=150&auto=format&fit=crop&q=60'
      : regCategory === 'اکسسوری'
        ? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60';

    const newProductItem: ProductSKU = {
      id: newSkuId,
      name: regName,
      enName: regEnName || regName,
      priceBuy: Number(regPriceBuy) || 100000,
      priceSell: Number(regPriceSell) || 200000,
      stock: Number(regStock) || 0,
      image: regImage.trim() || fallbackImage,
      category: regCategory
    };

    setProducts(prev => {
      const currentList = prev[regBrandId] || [];
      return {
        ...prev,
        [regBrandId]: [...currentList, newProductItem]
      };
    });

    // Reset Form
    setRegName('');
    setRegEnName('');
    setRegImage('');
    setRegDesc('');
    
    alert(lang === 'fa' 
      ? `محصول جدید "${regName}" با شناسه SKU: ${newSkuId.toUpperCase()}، موجودی اولیه ${regStock} عدد و مشخصات ثبت شده با موفقیت به انبار برند مربوطه افزوده شد.` 
      : `New product registered successfully with SKU ${newSkuId.toUpperCase()}!`
    );
  };

  // Interactive Brand warnings (the warning logic on page 32 of PDF)
  const handleIssueWarning = (brandId: string) => {
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        const nextWarnings = b.warningsCount + 1;
        let newScore = Math.max(0, b.score - 8); // issuing warning decreases rating score
        let newRisk = b.risk;
        if (nextWarnings >= 2) newRisk = 'High';
        else if (nextWarnings >= 1) newRisk = 'Medium';

        let newTier = b.tier;
        if (newScore < 60) newTier = 'Nova';
        else if (newScore < 75) newTier = 'Standard';
        else if (newScore < 90) newTier = 'Mumtaz';

        return {
          ...b,
          warningsCount: nextWarnings,
          score: newScore,
          tier: newTier,
          risk: newRisk
        };
      }
      return b;
    }));
  };

  const handleClearWarnings = (brandId: string) => {
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        return {
          ...b,
          warningsCount: 0,
          score: Math.min(100, b.score + 10), // clearing warnings / coaching increases score
          risk: 'Low'
        };
      }
      return b;
    }));
  };

  // Toggle operational task completion
  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) return { ...item, done: !item.done };
      return item;
    }));
  };

  // Order state transition handler (Registered -> Paid -> Preparing -> Shipped -> Delivered -> Cancelled)
  const handleTransitionOrderStatus = (orderId: string, nextStatus: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  // BRAND PRE-REGISTRATION HANDLER (CEO ACTION)
  const handleRegisterBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newBrandOwner.trim() || !newBrandEmail.trim() || !newBrandPhone.trim()) {
      alert(lang === 'fa' ? 'لطفاً تمامی فیلدهای الزامی (نام برند، نام مالک، ایمیل و شماره تماس) را تکمیل کنید.' : 'Please fill out all required fields (Brand Name, Owner, Email, and Phone).');
      return;
    }

    const brandId = newBrandEnName.trim() 
      ? newBrandEnName.toLowerCase().replace(/\s+/g, '_') 
      : `brand_${Date.now().toString().slice(-4)}`;

    const generatedContractDraft = `این قرارداد فی‌مابین هلدینگ زنجیره‌ای کارا (مدیریت ارشد) و برند همکار ${newBrandName} به مالکیت خانم/آقای ${newBrandOwner} بر اساس مشخصات فعالیت (${newBrandSpecs || 'مقرر در سند فعالیت تخصصی'}) و با میزان سرمایه اولیه ورودی ${newBrandCapital.toLocaleString()} دلار منعقد می‌گردد. طرفین متعهد به ارائه بالاترین کیفیت محصولات طبق دستورالعمل‌های کنترل کیفیت کارا بوده و توزیع بدون فاکتور رسمی یا عرضه کالای ناسالم موجب جریمه و کسر امتیاز بهداشت برند خواهد شد.`;

    const newBrand: BrandPartner = {
      id: brandId,
      name: newBrandName,
      enName: newBrandEnName || newBrandName,
      owner: newBrandOwner,
      category: newBrandCategory,
      enCategory: newBrandCategory === 'مراقبت پوست' ? 'Skincare' : newBrandCategory === 'عطر و ادکلن' ? 'Perfumes' : newBrandCategory === 'صنایع دستی' ? 'Handcrafts' : 'Accessories',
      capital: Number(newBrandCapital) || 3000,
      capitalTier: newBrandCapital >= 4000 ? 'Premium' : newBrandCapital >= 2000 ? 'Growth' : 'Starter',
      score: 100, // perfect initial rating
      tier: 'Nova',
      enTier: 'Nova Partner',
      risk: 'Low',
      errorRate: 0.0,
      refundRate: 0.0,
      joinedDate: new Date().toLocaleDateString('fa-IR') || '1405/04/20',
      warningsCount: 0,
      salesCount: 0,
      email: newBrandEmail,
      phone: newBrandPhone,
      activitySpecs: newBrandSpecs,
      contractStatus: 'draft',
      contractText: generatedContractDraft,
      accessLink: ''
    };

    setBrands(prev => [...prev, newBrand]);
    setProducts(prev => ({ ...prev, [brandId]: [] })); // initialize empty product catalog
    setSelectedContractBrandId(brandId); // auto-select this brand in contract panel

    // reset fields
    setNewBrandName('');
    setNewBrandEnName('');
    setNewBrandOwner('');
    setNewBrandSpecs('');
    setNewBrandCapital(3000);
    setNewBrandEmail('');
    setNewBrandPhone('');

    alert(lang === 'fa' 
      ? `برند جدید "${newBrandName}" با موفقیت در سیستم پیش‌ثبت‌نام شد. لطفاً به بخش امضا و نهایی‌سازی قرارداد بروید.`
      : `Brand "${newBrandName}" pre-registered! Please proceed to the agreement & signature sub-tab.`
    );
  };

  // CONTRACT SIGNING HANDLER (CEO & PARTNER ACTIONS)
  const handleSignContract = (brandId: string, signatory: 'ceo' | 'brand_owner') => {
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        let nextStatus: 'draft' | 'ceo_signed' | 'fully_signed' = b.contractStatus || 'draft';
        if (signatory === 'ceo') {
          nextStatus = b.contractStatus === 'fully_signed' ? 'fully_signed' : 'ceo_signed';
        } else if (signatory === 'brand_owner') {
          nextStatus = b.contractStatus === 'ceo_signed' ? 'fully_signed' : 'fully_signed'; // simulate that owner signature seals the contract
        }

        return {
          ...b,
          contractStatus: nextStatus
        };
      }
      return b;
    }));
  };

  // SPECIAL BRAND LINK GENERATOR (CEO ACTION)
  const handleGenerateBrandLink = (brandId: string) => {
    const matched = brands.find(b => b.id === brandId);
    if (!matched) return;
    if (matched.contractStatus !== 'fully_signed') {
      alert(lang === 'fa' 
        ? 'خطا: برای تولید لینک دسترسی ویژه، ابتدا باید قرارداد همکاری توسط هر دو طرف (مدیریت ارشد و مالک برند) امضا و نهایی شود.'
        : 'Error: Contract must be fully signed before generating access link.'
      );
      return;
    }

    const token = `link-brand-${brandId}-${Math.floor(Math.random() * 9000) + 1000}`;
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        return { ...b, accessLink: token };
      }
      return b;
    }));

    alert(lang === 'fa'
      ? `لینک دسترسی اختصاصی برای برند "${matched.name}" تولید شد. توکن: ${token}`
      : `Special access link generated for brand "${matched.enName}"!`
    );
  };

  // EMPLOYEE CONTRACT REGISTRATION (CEO ACTION)
  const handleRegisterEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpPhone.trim()) {
      alert(lang === 'fa' ? 'لطفاً مشخصات کارمند (نام، ایمیل و شماره تماس) را وارد کنید.' : 'Please enter employee name, email, and phone.');
      return;
    }

    const newEmpId = `emp_${Date.now().toString().slice(-4)}`;
    const newEmployee = {
      id: newEmpId,
      name: newEmpName,
      email: newEmpEmail,
      phone: newEmpPhone,
      department: newEmpDept,
      salary: Number(newEmpSalary) || 120000000,
      workingHours: Number(newEmpHours) || 44,
      duration: '12 ماه',
      status: 'pending_approval',
      accessLink: ''
    };

    setEmployees(prev => [...prev, newEmployee]);

    // reset fields
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPhone('');

    alert(lang === 'fa'
      ? `مشخصات کارمند جدید "${newEmpName}" با موفقیت ثبت شد. قرارداد کاری جهت تایید نهایی به میز کار مدیریت ارشد فرستاده شد.`
      : `Employee "${newEmpName}" registered. Contract is pending CEO approval.`
    );
  };

  // EMPLOYEE CONTRACT APPROVAL (CEO ACTION)
  const handleApproveEmployeeContract = (empId: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        return { ...emp, status: 'approved' };
      }
      return emp;
    }));
  };

  // SPECIAL EMPLOYEE ENTRY LINK GENERATOR (CEO ACTION)
  const handleGenerateEmployeeLink = (empId: string) => {
    const matched = employees.find(e => e.id === empId);
    if (!matched) return;
    if (matched.status !== 'approved') {
      alert(lang === 'fa' 
        ? 'خطا: ابتدا باید قرارداد کارمند توسط مدیریت ارشد تایید و امضا شود.' 
        : 'Error: Employee contract must be approved first.'
      );
      return;
    }

    const token = `link-emp-${matched.id}-${Math.floor(Math.random() * 9000) + 1000}`;
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        return { ...emp, accessLink: token };
      }
      return emp;
    }));

    alert(lang === 'fa'
      ? `لینک اختصاصی برای ورود کارشناس "${matched.name}" با موفقیت صادر شد. توکن: ${token}`
      : `Special access link generated for employee "${matched.name}"!`
    );
  };

  // SMART BUSINESS PORTAL LOGIN HANDLER
  const handleSmartLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMessage(null);

    const cred = loginCredential.trim().toLowerCase();
    const token = loginToken.trim();

    if (!cred && !token) {
      setLoginError(lang === 'fa' ? 'لطفاً ایمیل، شماره تماس یا توکن ورود را وارد کنید.' : 'Please enter your email, phone, or special token.');
      return;
    }

    // 1. Check CEO login
    if (cred === 'ceo@kara.com' || cred === '09120000000') {
      setCeoSession(true);
      setActiveRole('ceo');
      setLoginSuccessMessage(lang === 'fa' ? 'خوش آمدید مدیریت ارشد هلدینگ کارا. دسترسی کامل فعال شد.' : 'Welcome CEO. Full control granted.');
      return;
    }

    // 2. Check token or email/phone for Brands
    const brandMatch = brands.find(b => 
      (b.email && b.email.toLowerCase() === cred) || 
      (b.phone && b.phone === cred) ||
      (b.accessLink && b.accessLink === token)
    );

    if (brandMatch) {
      if (token && brandMatch.accessLink !== token) {
        setLoginError(lang === 'fa' ? 'توکن اختصاصی وارد شده معتبر نیست.' : 'Invalid special token.');
        return;
      }
      setActiveBrandSession(brandMatch.id);
      setSelectedFounderBrandId(brandMatch.id);
      setActiveRole('brand');
      setLoginSuccessMessage(lang === 'fa' ? `خوش آمدید مالک برند "${brandMatch.name}". پنل اختصاصی شما فعال شد.` : `Welcome ${brandMatch.enName} founder.`);
      return;
    }

    // 3. Check Employee Login
    const empMatch = employees.find(emp => 
      emp.email.toLowerCase() === cred || 
      emp.phone === cred ||
      (emp.accessLink && emp.accessLink === token)
    );

    if (empMatch) {
      if (empMatch.status !== 'approved') {
        setLoginError(lang === 'fa' 
          ? `حساب کاربری شما تعلیق است یا قرارداد کاری تان هنوز توسط مدیریت ارشد تایید نشده است.` 
          : 'Your employment contract is pending approval.'
        );
        return;
      }
      if (token && empMatch.accessLink !== token) {
        setLoginError(lang === 'fa' ? 'پیوند اختصاصی کارمند معتبر نیست.' : 'Invalid employee token.');
        return;
      }
      setActiveEmployeeSession(empMatch.id);
      setOpsSubTab(empMatch.department as any);
      setActiveRole('ops');
      setLoginSuccessMessage(lang === 'fa' ? `خوش آمدید همکار عزیز "${empMatch.name}". دسترسی به بخش تخصصی فعال شد.` : `Welcome team member.`);
      return;
    }

    // 4. Guest login as customer
    if (cred === 'customer@kara.local' || cred === '09128888888') {
      setActiveRole('customer');
      setLoginSuccessMessage(lang === 'fa' ? 'ورود به پورتال مشتریان کارا موفقیت‌آمیز بود.' : 'Successfully entered Customer Portal.');
      return;
    }

    setLoginError(lang === 'fa' ? 'مشخصات وارد شده یافت نشد. لطفاً از مقادیر راهنمای تست زیر استفاده کنید.' : 'Invalid credentials. Please use the test accounts listed below.');
  };

  // Buy Product flow for interactive client interface
  const handlePurchaseProduct = async (product: ProductSKU, brandId: string) => {
    if (product.stock <= 0) {
      alert(lang === 'fa' ? 'متاسفیم، این کالا در حال حاضر اتمام موجودی است.' : 'Sorry, this product is out of stock.');
      return;
    }

    // Decrement local stock
    setProducts(prev => {
      const brandProducts = prev[brandId] || [];
      const updated = brandProducts.map(p => {
        if (p.id === product.id) {
          const nextStock = p.stock - 1;
          return { ...p, stock: nextStock };
        }
        return p;
      });
      return { ...prev, [brandId]: updated };
    });

    // Record new order
    const nextOrderId = `TXN-${Date.now().toString().slice(-4)}`;
    const matchedBrand = brands.find(b => b.id === brandId);
    const newOrder = {
      id: nextOrderId,
      customerName: lang === 'fa' ? 'مشتری دمو کارا' : 'KARA Demo Customer',
      brandName: matchedBrand ? (lang === 'fa' ? matchedBrand.name : matchedBrand.enName) : brandId,
      amount: product.priceSell,
      item: lang === 'fa' ? product.name : product.enName,
      status: 'paid',
      date: new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')
    };

    setOrders(prev => [newOrder, ...prev]);

    // Increment user loyalty points (+150 points for purchase)
    setCustomerPoints(prev => prev + 150);

    // Increment sales count for brand
    setBrands(prev => prev.map(b => {
      if (b.id === brandId) {
        return { ...b, salesCount: b.salesCount + 1 };
      }
      return b;
    }));

    // CRITICAL INTEGRATION: APP SHEET ROW INSERTION
    // If a spreadsheet is connected via Google Drive, write the transaction directly in the ledger!
    if (onAddTransaction && sheetData) {
      try {
        const persianDate = new Date().toLocaleDateString('fa-IR');
        const formattedAmount = product.priceSell.toString();
        const rowValues = [
          persianDate,
          lang === 'fa' ? 'فروش محصول' : 'Sales Revenue',
          `${lang === 'fa' ? 'خرید آنلاین:' : 'Purchase SKU:'} ${product.name} (${matchedBrand ? matchedBrand.enName : brandId})`,
          formattedAmount,
          'درآمد',
          nextOrderId
        ];
        await onAddTransaction(rowValues);
      } catch (sheetErr) {
        console.warn('Google Sheet integration write deferred or offline:', sheetErr);
      }
    }

    setPurchaseSuccessMessage(
      lang === 'fa'
        ? `خرید موفقیت‌آمیز کالا! تراکنش ${nextOrderId} به مبلغ ${product.priceSell.toLocaleString()} ریال با موفقیت در لجر مالی سازمان کارا ثبت شد و ۱۵۰ امتیاز وفاداری به حساب شما اضافه شد (مجموع امتیازات شما: ${(customerPoints + 150).toLocaleString()} امتیاز).`
        : `Purchase successful! Transaction ${nextOrderId} for ${product.priceSell.toLocaleString()} IRR was written to KARA financial ledger, and +150 loyalty points added to your account (Total points: ${(customerPoints + 150).toLocaleString()}).`
    );

    setTimeout(() => {
      setPurchaseSuccessMessage(null);
    }, 8000);
  };

  // Create customer complaint ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim()) return;
    const newTkt = {
      id: `TKT-${Math.floor(Math.random() * 800) + 100}`,
      customer: lang === 'fa' ? 'مشتری دمو کارا' : 'Demo Customer',
      subject: newTicketSubject,
      status: 'pending',
      reply: ''
    };
    setCustomerTickets(prev => [...prev, newTkt]);
    setNewTicketSubject('');
  };

  // Compute stats from sheetData + offline state combined
  const stats = useMemo(() => {
    let sheetIncome = 0;
    let sheetExpense = 0;
    const transactionsList: Array<{ date: string; category: string; description: string; amount: number; type: string }> = [];

    if (sheetData && sheetData.headers && sheetData.rows) {
      const headers = sheetData.headers.map(h => h.trim());
      const typeIdx = headers.findIndex(h => h === 'نوع' || h.toLowerCase() === 'type');
      const amountIdx = headers.findIndex(h => h === 'مبلغ (ریال/تومان)' || h.toLowerCase().includes('amount'));
      const dateIdx = headers.findIndex(h => h === 'تاریخ' || h.toLowerCase() === 'date');
      const catIdx = headers.findIndex(h => h === 'دسته بندی' || h.toLowerCase().includes('category'));
      const descIdx = headers.findIndex(h => h === 'توضیحات' || h.toLowerCase() === 'description');

      sheetData.rows.forEach(row => {
        const typeVal = typeIdx !== -1 ? row[typeIdx] || '' : '';
        const amountValStr = amountIdx !== -1 ? row[amountIdx] || '0' : '0';
        const amountClean = parseFloat(amountValStr.replace(/[^\d.-]/g, '')) || 0;

        const isIncome = typeVal.includes('درآمد') || typeVal.toLowerCase().includes('income');
        const isExpense = typeVal.includes('هزینه') || typeVal.toLowerCase().includes('expense');

        if (isIncome) sheetIncome += amountClean;
        else if (isExpense) sheetExpense += amountClean;

        transactionsList.push({
          date: dateIdx !== -1 ? row[dateIdx] || '' : '',
          category: catIdx !== -1 ? row[catIdx] || '' : '',
          description: descIdx !== -1 ? row[descIdx] || '' : '',
          amount: amountClean,
          type: isIncome ? 'income' : 'expense'
        });
      });
    }

    // Combine with the simulated orders
    const ordersVolume = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.amount : 0), 0);
    const totalIncome = (sheetIncome || 1450000000) + ordersVolume; // Seed background volume if empty sheet
    const totalExpense = sheetExpense || 490000000;
    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      transactions: transactionsList.slice(-4).reverse()
    };
  }, [sheetData, orders]);

  // Chart Data compilation
  const chartData = useMemo(() => {
    return [
      { name: isRtl ? 'فروردین' : 'Jan', income: 450000000, expense: 120000000 },
      { name: isRtl ? 'اردیبهشت' : 'Feb', income: 620000000, expense: 180000000 },
      { name: isRtl ? 'خرداد' : 'Mar', income: 590000000, expense: 220000000 },
      { name: isRtl ? 'تیر' : 'Apr', income: 880000000, expense: 280000000 },
      { name: isRtl ? 'مرداد' : 'May', income: 940000000, expense: 310000000 },
      { name: isRtl ? 'شهریور' : 'Jun', income: stats.totalIncome * 0.8, expense: stats.totalExpense },
    ];
  }, [stats, isRtl]);

  const recentDriveFiles = useMemo(() => {
    return files.slice(0, 3);
  }, [files]);

  // Filtering Brands based on search query and capital levels (Starter, Growth, Premium)
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const matchQuery = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.enName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = categoryFilter === 'All' || b.category === categoryFilter;
      const matchCapital = capitalFilter === 'All' || b.capitalTier === capitalFilter;

      return matchQuery && matchCategory && matchCapital;
    });
  }, [brands, searchQuery, categoryFilter, capitalFilter]);

  // Selected brand metadata for Founder view
  const founderBrand = useMemo(() => {
    return brands.find(b => b.id === selectedFounderBrandId) || brands[0];
  }, [brands, selectedFounderBrandId]);

  // Brand specific orders: filters out general logs so brand owners ONLY see their own transactions
  const brandSpecificOrders = useMemo(() => {
    return orders.filter(o => {
      const brandNameLower = o.brandName.toLowerCase();
      const founderBrandNameLower = founderBrand.name.toLowerCase();
      const founderBrandEnLower = founderBrand.enName.toLowerCase();
      const founderBrandId = founderBrand.id.toLowerCase();
      return (
        brandNameLower.includes(founderBrandNameLower) || 
        brandNameLower.includes(founderBrandEnLower) || 
        brandNameLower.includes(founderBrandId) ||
        o.brandName === founderBrand.name
      );
    });
  }, [orders, founderBrand]);

  // REAL-TIME ANALYZING BUSINESS INTELLIGENCE ENGINE (KARA Brain AI Advice)
  const dynamicKaraBrainTips = useMemo(() => {
    const brandProducts = products[founderBrand.id] || [];
    const lowStockItems = brandProducts.filter(p => p.stock > 0 && p.stock <= 3);
    const outOfStockItems = brandProducts.filter(p => p.stock === 0);
    const tips: string[] = [];

    if (lang === 'fa') {
      // 1. Inventory level active analysis
      if (outOfStockItems.length > 0) {
        tips.push(`⚠️ تحلیل موجودی انبار: تعداد ${outOfStockItems.length} کالای شما در سیستم اتمام موجودی شده و به صورت خودکار از دید خریداران پنهان گردیده است. سریعاً نسبت به تامین و ارسال کالا از انبار مرکزی اقدام فرمایید.`);
      } else if (lowStockItems.length > 0) {
        tips.push(`⚠️ هشدار زنجیره تامین: محصولات پرتقاضای شما (${lowStockItems.map(p => p.name).join('، ')}) دارای موجودی بحرانی (کمتر از ۳ عدد) هستند. ریسک خروج کالا از کاتالوگ بالا ارزیابی می‌شود.`);
      } else {
        tips.push(`✅ وضعیت موجودی کالا: موجودی انبار برند شما کاملاً باثبات بوده و توازن عرضه و تقاضا در سطح ایده‌آل ۱۰۰٪ قرار دارد.`);
      }

      // 2. Performance score and warnings active analysis
      if (founderBrand.warningsCount > 0) {
        tips.push(`🚨 تحلیل کیفیت (ماده ۱۰ قانون): شما دارای ${founderBrand.warningsCount} اخطار نظارتی فعال هستید که رتبه شما را تحت تاثیر قرار داده است. لطفاً جهت بازیابی امتیاز به بخش نظارت پیام دهید.`);
      } else if (founderBrand.score >= 90) {
        tips.push(`⭐ دستاورد رده طلایی: به علت بالا بودن امتیاز سلامت شما (${founderBrand.score} امتیاز)، زنجیره تحویل شما اولویت اول پیک‌های هوایی سراسری قرار گرفته است.`);
      } else {
        tips.push(`💡 بهینه‌سازی راندمان: امتیاز بهداشت برند شما ${founderBrand.score} است. با برگزاری دوره کوتاه‌مدت استانداردهای بسته‌بندی برای اپراتورهای خود، به راحتی به سطح طلایی ارتقا می‌یابید.`);
      }

      // 3. Dynamic Cross-brand bundling & AI opportunity recommendation
      if (founderBrand.id === 'luna') {
        tips.push(`⚡ پیشنهاد باندلینگ هوشمند: محصولات پرفروش لونا پلاس با پکیج‌های هدیه چرمی "برند کاروان" همبستگی خرید ۵۵٪ دارند. راه‌اندازی باندل مشترک سود ناخالص شما را ۱۲٪ افزایش می‌دهد.`);
      } else if (founderBrand.id === 'delara') {
        tips.push(`⚡ پیشنهاد باندلینگ هوشمند: خریداران عطر مینی دلآرا تمایل زیادی به شال‌های آناهیتا دارند. پیشنهاد همیاری و باندل عیدانه با برند آناهیتا جهت ارتقای فروش.`);
      } else {
        tips.push(`⚡ فرصت بازاریابی هوش تجاری: بر اساس داده‌های ترافیک مصرف‌کنندگان، افزودن کاتالوگ محصولات مکمل و کمپین تصویری فعال در اینستاگرام، تا ۴۲٪ بازدیدهای ارگانیک کاتالوگ شما را بهبود خواهد بخشید.`);
      }
    } else {
      // English
      if (outOfStockItems.length > 0) {
        tips.push(`⚠️ Stock Analysis: ${outOfStockItems.length} SKUs are out of stock and hidden from consumer shopping view. Replenish immediately to resume client discovery.`);
      } else if (lowStockItems.length > 0) {
        tips.push(`⚠️ Critical Inventory: Your item ${lowStockItems.map(p => p.enName).join(', ')} is below 3 units. Supply chain delay risks losing sales momentum.`);
      } else {
        tips.push(`✅ Supply Health: Your active items are well-stocked, maintaining a 100% stable pipeline.`);
      }

      if (founderBrand.score >= 90) {
        tips.push(`⭐ High Rating Award: Your ${founderBrand.score} rating guarantees next-day VIP shipping for all customer checkouts.`);
      } else {
        tips.push(`💡 Performance Lift: Complete the customer packaging audit course to recover standard margins.`);
      }

      tips.push(`⚡ Cross-Merchant Bundling: Users frequently buy your items with KARA Gift Boxes. Forming a bundle can improve gross margin by 15%.`);
    }

    return tips;
  }, [founderBrand, products, lang]);

  // AI-powered automated tips (KARA Brain) depending on Brand Status
  const getKaraBrainTips = (brand: BrandPartner) => {
    return dynamicKaraBrainTips;
  };

  const renderLoginGate = (targetRole: 'ceo' | 'brand' | 'ops') => {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      setLoginSuccessMessage(null);

      const credential = loginCredential.trim().toLowerCase();
      const token = loginToken.trim();

      if (!credential) {
        setLoginError(lang === 'fa' ? 'لطفا ایمیل یا شماره تماس خود را وارد کنید.' : 'Please enter your email or phone.');
        return;
      }

      if (targetRole === 'ceo') {
        if ((credential === 'ceo@kara.com' || credential === '0700000000' || credential === 'admin') && (token === 'admin' || token === '')) {
          setCeoSession(true);
          setLoginSuccessMessage(lang === 'fa' ? 'خوش آمدید مدیر ارشد!' : 'Welcome CEO!');
        } else {
          setLoginError(lang === 'fa' ? 'اطلاعات ورود مدیر ارشد نادرست است. (ceo@kara.com / admin)' : 'Invalid CEO credentials. (Try: ceo@kara.com / admin)');
        }
      } else if (targetRole === 'brand') {
        const matchedBrand = brands.find(b => 
          (b.email && b.email.toLowerCase() === credential) || 
          (b.phone && b.phone === credential) ||
          (b.accessLink && b.accessLink === credential) ||
          (token && b.accessLink && b.accessLink === token)
        );

        if (matchedBrand) {
          if (matchedBrand.contractStatus !== 'fully_signed') {
            setLoginError(lang === 'fa' 
              ? 'قرارداد شما هنوز به طور نهایی امضا نشده است. لطفا ابتدا با مدیریت ارشد قرارداد را نهایی و امضا کنید.' 
              : 'Your contract is not fully signed yet. Please finalize signing with the CEO first.');
            return;
          }
          setActiveBrandSession(matchedBrand.id);
          setSelectedFounderBrandId(matchedBrand.id);
          setLoginSuccessMessage(lang === 'fa' ? `خوش آمدید، پنل برند ${matchedBrand.name} فعال شد.` : `Welcome, brand panel for ${matchedBrand.enName} is active.`);
        } else {
          setLoginError(lang === 'fa' 
            ? 'برند پیدا نشد یا اطلاعات معتبر نیست. از ایمیل، شماره تماس یا لینک اختصاصی استفاده کنید.' 
            : 'Brand not found or credentials invalid. Use your registered email, phone or access token.');
        }
      } else if (targetRole === 'ops') {
        const matchedEmp = employees.find(e => 
          (e.email && e.email.toLowerCase() === credential) || 
          (e.phone && e.phone === credential) ||
          (e.accessLink && e.accessLink === credential) ||
          (token && e.accessLink && e.accessLink === token)
        );

        if (matchedEmp) {
          if (matchedEmp.status !== 'approved') {
            setLoginError(lang === 'fa' 
              ? 'قرارداد کاری شما هنوز توسط مدیر ارشد تایید نشده است.' 
              : 'Your work contract has not been approved by the CEO yet.');
            return;
          }
          setActiveEmployeeSession(matchedEmp.id);
          setLoginSuccessMessage(lang === 'fa' ? `خوش آمدید، دسترسی بخش فعال شد.` : `Welcome, access active.`);
        } else {
          setLoginError(lang === 'fa' 
            ? 'کارمند پیدا نشد یا اطلاعات معتبر نیست. از ایمیل یا شماره تماس ثبت شده استفاده کنید.' 
            : 'Employee not found or credentials invalid. Use your registered email, phone or access token.');
        }
      }
    };

    const roleTitles = {
      ceo: { fa: 'درگاه امن مدیریت ارشد کارا', en: 'KARA Executive Portal' },
      brand: { fa: 'پورتال اختصاصی صاحبان برند', en: 'KARA Partner Brand Portal' },
      ops: { fa: 'درگاه تیم اجرایی و بازرسی', en: 'KARA Operations & Inspection Hub' }
    };

    const roleIcon = {
      ceo: <Award className="w-12 h-12 text-[#e5b85a] animate-pulse" />,
      brand: <ShoppingBag className="w-12 h-12 text-pink-400 animate-pulse" />,
      ops: <Users className="w-12 h-12 text-emerald-400 animate-pulse" />
    };

    return (
      <div className="max-w-md mx-auto my-12 glass-card rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-right animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <KaraLogo size="md" showText={false} />
          </div>
          <div className="p-2 bg-white/[0.03] rounded-full border border-white/5 mb-3 flex items-center gap-2">
            {roleIcon[targetRole]}
            <span className="text-xs font-black px-2 py-0.5 bg-white/5 rounded-md border border-white/5">{targetRole.toUpperCase()}</span>
          </div>
          <h2 className="text-sm md:text-base font-black text-white">{roleTitles[targetRole][lang]}</h2>
          <p className="text-[9px] text-white/50 mt-1">
            {lang === 'fa' 
              ? 'جهت ورود امن به پنل اختصاصی، احراز هویت الزامی است' 
              : 'Authentication required for secure portal access'}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5 text-right">
              {lang === 'fa' ? 'ایمیل، شماره تماس یا کلید دسترسی' : 'Email, Phone, or Access Token'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-white/30" />
              </span>
              <input
                type="text"
                placeholder={lang === 'fa' ? 'مثال: luna@brand.com یا 0912...' : 'e.g. luna@brand.com or token'}
                value={loginCredential}
                onChange={(e) => setLoginCredential(e.target.value)}
                className="w-full text-xs bg-[#12020d] border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e5b85a] transition text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5 text-right">
              {lang === 'fa' ? 'رمز عبور یا کلید دسترسی (در صورت نیاز)' : 'Password or Access Token (Optional)'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-white/30" />
              </span>
              <input
                type="password"
                placeholder={lang === 'fa' ? 'اختیاری است' : 'Optional'}
                value={loginToken}
                onChange={(e) => setLoginToken(e.target.value)}
                className="w-full text-xs bg-[#12020d] border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e5b85a] transition text-right"
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2 text-right">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccessMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2 text-right">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{loginSuccessMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-l from-[#e5b85a] to-[#cfa141] hover:from-[#fcd34d] hover:to-[#e5b85a] text-[#1b0313] font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/10"
          >
            {lang === 'fa' ? 'تایید و ورود به پنل' : 'Authenticate & Enter'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center text-[10px] text-white/40 space-y-2">
          <p className="font-sans">
            {lang === 'fa' ? '💡 راهنمای ورود نمایشی:' : '💡 Demo Login Quick-Guide:'}
          </p>
          {targetRole === 'ceo' && (
            <p className="text-[#e5b85a] font-mono">ceo@kara.com / admin</p>
          )}
          {targetRole === 'brand' && (
            <div className="space-y-1 font-mono text-pink-300">
              <p>Email: luna@brand.com (Luna)</p>
              <p>Access Token: link-brand-karwan-8192 (Karwan)</p>
            </div>
          )}
          {targetRole === 'ops' && (
            <div className="space-y-1 font-mono text-emerald-300">
              <p>Email: ahmad@kara.com (Approved)</p>
              <p>Email: zahra@kara.com (Pending - Approve first in CEO Panel)</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Role Perspetives Tab switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e5b85a]/15 pb-5">
        <div>
          <h2 className="text-xl font-black text-[#e5b85a] tracking-tight font-sans">
            {lang === 'fa' ? 'سامانه هوشمند زنجیره‌ای کارا (KARA Commerce OS)' : 'KARA Commerce OS Hub'}
          </h2>
          <span className="text-[10px] text-white/40 block font-mono mt-0.5">
            ONE PLATFORM. HUNDREDS OF BRANDS. ONE STANDARD. // یک پلتفرم، صدها برند، یک استاندارد
          </span>
        </div>

        {/* Dynamic perspective selectors */}
        <div className="flex flex-wrap bg-[#1b0313]/90 p-1 border border-[#e5b85a]/20 rounded-2xl gap-1 text-[11px] font-bold">
          <button
            onClick={() => setActiveRole('ceo')}
            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'ceo' 
                ? 'bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white border border-[#e5b85a]/30 shadow' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#e5b85a]" />
            <span>{lang === 'fa' ? '👑 مدیریت ارشد کارا' : '👑 KARA CEO Panel'}</span>
          </button>
          
          <button
            onClick={() => setActiveRole('ops')}
            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'ops' 
                ? 'bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white border border-[#e5b85a]/30 shadow' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-[#e5b85a]" />
            <span>{lang === 'fa' ? '⚙️ تیم اجرایی و بازرسی' : '⚙️ Operations & Checklists'}</span>
          </button>

          <button
            onClick={() => setActiveRole('brand')}
            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'brand' 
                ? 'bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white border border-[#e5b85a]/30 shadow' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#e5b85a]" />
            <span>{lang === 'fa' ? '👩‍💼 صاحبان برند افغان' : '👩‍💼 Founder Panel'}</span>
          </button>

          <button
            onClick={() => setActiveRole('customer')}
            className={`px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'customer' 
                ? 'bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white border border-[#e5b85a]/30 shadow' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#e5b85a]" />
            <span>{lang === 'fa' ? '🛍️ پورتال خرید دمو' : '🛍️ Client Purchase'}</span>
          </button>
        </div>
      </div>

      {/* PURCHASE SUCCESS ALERT BANNER */}
      {purchaseSuccessMessage && (
        <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-200 flex items-center gap-3 animate-pulse text-right">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <span>{purchaseSuccessMessage}</span>
        </div>
      )}

      {/* FINANCIAL GENERAL KPI CARDS */}
      {(activeRole === 'ceo' || (activeRole === 'ops' && opsSubTab === 'finance')) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-2xl p-5 text-white shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 text-xs font-semibold">
                {lang === 'fa' ? 'درآمد کل اکوسیستم کارا' : 'Combined Ecosystem Revenue'}
              </span>
              <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-black font-mono text-emerald-300">
                {stats.totalIncome.toLocaleString()}
              </h3>
              <span className="text-[9px] text-emerald-400/80 block mt-0.5 font-mono">
                {lang === 'fa' ? 'ریال / سهم کارا طبق پلتفرم' : 'IRR / Sheets Ledger Data'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#e5b85a]/15 to-[#b58c3d]/5 border border-[#e5b85a]/25 rounded-2xl p-5 text-white shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[#e5b85a] text-xs font-semibold">
                {lang === 'fa' ? 'مجموع سرمایه فعال جذب شده' : 'Total Attracted Capital'}
              </span>
              <div className="w-8 h-8 bg-[#e5b85a]/20 border border-[#e5b85a]/30 rounded-lg flex items-center justify-center">
                <Coins className="w-4 h-4 text-[#e5b85a]" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-black font-mono text-[#e5b85a]">
                $600,000
              </h3>
              <span className="text-[9px] text-[#e5b85a]/80 block mt-0.5 font-mono">
                {lang === 'fa' ? '۲۰۰ برند شریک • متوسط سرمایه ۳۰۰۰ دلار' : '200 Partner Brands • Average $3,000 per brand'}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/5 border border-purple-500/20 rounded-2xl p-5 text-white shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-xs font-semibold">
                {lang === 'fa' ? 'مجموع هزینه‌ها و لجستیک' : 'Ecosystem Expense & Logistics'}
              </span>
              <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-black font-mono text-purple-300">
                {stats.totalExpense.toLocaleString()}
              </h3>
              <span className="text-[9px] text-purple-400/80 block mt-0.5 font-mono">
                {lang === 'fa' ? 'کسر هزینه‌های بسته بندی و ارسال' : 'IRR / Package & Cargo Overhead'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👑 PERSPECTIVE 1: CEO & TOP LEADERSHIP MANAGEMENT */}
      {/* ========================================================================= */}
      {activeRole === 'ceo' && (
        !ceoSession ? (
          renderLoginGate('ceo')
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* CEO PANEL HEADER & LOGOUT */}
            <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#e5b85a]/10 bg-black/10">
              <div className="flex items-center gap-2">
                <span className="text-[#e5b85a] text-lg">👑</span>
                <div>
                  <p className="text-xs font-bold text-white">{lang === 'fa' ? 'میز کار مدیریت ارشد هلدینگ زنجیره‌ای کارا' : 'KARA CEO Executive Boardroom'}</p>
                  <p className="text-[9px] text-white/40">{lang === 'fa' ? 'خوش آمدید مدیر ارشد • دسترسی کامل مدیریتی' : 'Welcome CEO Admin • Full root privileges'}</p>
                </div>
              </div>

              {/* Sub-Tabs for CEO */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCeoSubTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                    ceoSubTab === 'overview'
                      ? 'bg-[#e5b85a]/15 text-[#e5b85a] border border-[#e5b85a]/25'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {lang === 'fa' ? '📊 خلاصه و آمارها' : '📊 Analytics'}
                </button>
                <button
                  onClick={() => setCeoSubTab('contracts')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                    ceoSubTab === 'contracts'
                      ? 'bg-[#e5b85a]/15 text-[#e5b85a] border border-[#e5b85a]/25'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {lang === 'fa' ? '🤝 ثبت و قراردادهای برندها' : '🤝 Brand Contracts'}
                </button>
                <button
                  onClick={() => setCeoSubTab('employees')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition cursor-pointer ${
                    ceoSubTab === 'employees'
                      ? 'bg-[#e5b85a]/15 text-[#e5b85a] border border-[#e5b85a]/25'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  {lang === 'fa' ? '👥 مدیریت و استخدام کارمندان' : '👥 Staff Hiring'}
                </button>

                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

                <button
                  onClick={() => { setCeoSession(false); setLoginCredential(''); setLoginToken(''); }}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>{lang === 'fa' ? 'خروج' : 'Exit'}</span>
                </button>
              </div>
            </div>

            {ceoSubTab === 'overview' && (
              <>
                {/* Top CEO alert banner */}
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce flex-shrink-0" />
            <div>
              <p className="font-bold">
                {lang === 'fa' 
                  ? 'بررسی هفتگی مدیریت: ۲ برند در محدوده خطر ارزیابی امتیاز (زیر ۶۰ امتیاز) قرار دارند.' 
                  : 'CEO Alert: 2 partner brands have fallen into the High-Risk zone (Score under 60).'}
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {lang === 'fa'
                  ? 'برندهای "پوست ستاره" و "پوشاک مجلسی آریا" به دلیل نقص رضایت یا تاخیر ارسال مشمول آیین‌نامه اخطار هستند.'
                  : 'Setareh Skincare & Aria Formalwear require mandatory training and performance audits according to Article 10 of Constitution.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Interactive 200 Brands list manager */}
            <div className="glass-card rounded-2xl p-5 lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#e5b85a]" />
                  <span>
                    {lang === 'fa' 
                      ? 'دفترچه ثبت و ارزیابی برندهای همکار (۲۰۰ برند فعال)' 
                      : 'Ecosystem Partner Brands Directory (200 Brands)'}
                  </span>
                </h3>

                {/* Capital Tiers Info Badges */}
                <div className="flex gap-1.5 text-[9px] font-mono">
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                    Starter: $1.5K-3K
                  </span>
                  <span className="bg-[#e5b85a]/15 text-[#e5b85a] border border-[#e5b85a]/25 px-2 py-0.5 rounded-md">
                    Growth: $3K-7K
                  </span>
                  <span className="bg-rose-500/15 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-md">
                    Premium: $7K+
                  </span>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    placeholder={lang === 'fa' ? 'جستجو نام برند، مالک...' : 'Search brand or owner...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50"
                  />
                </div>

                {/* Category select filter */}
                <div className="relative">
                  <Filter className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/30" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-[#1b0313] border border-white/10 text-white/80 focus:outline-none cursor-pointer"
                  >
                    <option value="All">{lang === 'fa' ? 'همه دسته‌بندی‌ها' : 'All Categories'}</option>
                    <option value="مراقبت پوست">{lang === 'fa' ? 'مراقبت پوست' : 'Skincare'}</option>
                    <option value="عطر و ادکلن">{lang === 'fa' ? 'عطر و ادکلن' : 'Perfumes'}</option>
                    <option value="اکسسوری">{lang === 'fa' ? 'اکسسوری' : 'Accessories'}</option>
                    <option value="شال و روسری">{lang === 'fa' ? 'شال و روسری' : 'Scarves'}</option>
                    <option value="لوازم خانه">{lang === 'fa' ? 'لوازم خانه' : 'Home Decor'}</option>
                    <option value="صنایع دستی">{lang === 'fa' ? 'صنایع دستی' : 'Handicrafts'}</option>
                  </select>
                </div>

                {/* Capital Tier filter */}
                <div>
                  <select
                    value={capitalFilter}
                    onChange={(e) => setCapitalFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#1b0313] border border-white/10 text-white/80 focus:outline-none cursor-pointer"
                  >
                    <option value="All">{lang === 'fa' ? 'همه سطوح سرمایه‌گذاری' : 'All Investment Levels'}</option>
                    <option value="Starter">Starter ($1,500 - $3,000)</option>
                    <option value="Growth">Growth ($3,000 - $7,000)</option>
                    <option value="Premium">Premium ($7,000+)</option>
                  </select>
                </div>
              </div>

              {/* Brands Interactive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 font-medium">
                      <th className="pb-3 text-right">{lang === 'fa' ? 'برند / بنیان‌گذار' : 'Brand / Owner'}</th>
                      <th className="pb-3">{lang === 'fa' ? 'سرمایه فعال' : 'Capital'}</th>
                      <th className="pb-3 text-center">{lang === 'fa' ? 'امتیاز ارزیابی' : 'Score'}</th>
                      <th className="pb-3 text-center">{lang === 'fa' ? 'رتبه کیفی' : 'Tier'}</th>
                      <th className="pb-3 text-center">{lang === 'fa' ? 'تعداد هشدار' : 'Warnings'}</th>
                      <th className="pb-3 text-center">{lang === 'fa' ? 'عملیات نظارتی' : 'Supervision'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {filteredBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3">
                          <p className="text-white font-bold">{lang === 'fa' ? brand.name : brand.enName}</p>
                          <span className="text-[10px] text-rose-200/50 block font-normal">{brand.owner}</span>
                        </td>
                        <td className="py-3 font-mono">
                          <span className={
                            brand.capitalTier === 'Premium' ? 'text-rose-300' :
                            brand.capitalTier === 'Growth' ? 'text-[#e5b85a]' : 'text-emerald-300'
                          }>
                            ${brand.capital.toLocaleString()}
                          </span>
                          <span className="text-[8px] opacity-40 block">{brand.capitalTier}</span>
                        </td>
                        <td className="py-3 text-center font-mono">
                          <span className={
                            brand.score >= 90 ? 'text-emerald-400' :
                            brand.score >= 75 ? 'text-[#e5b85a]' : 'text-rose-400'
                          }>
                            {brand.score} / 100
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                            brand.tier === 'Golden' || brand.tier === 'Diamond' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' :
                            brand.tier === 'Mumtaz' ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300' :
                            brand.tier === 'Standard' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' :
                            'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                          }`}>
                            {lang === 'fa' ? brand.tier : brand.enTier}
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono">
                          {brand.warningsCount > 0 ? (
                            <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              {brand.warningsCount} اخطار
                            </span>
                          ) : (
                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {lang === 'fa' ? 'بدون خطا' : 'No alerts'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {brand.warningsCount > 0 && (
                              <button
                                onClick={() => handleClearWarnings(brand.id)}
                                className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded text-[10px] transition cursor-pointer"
                                title="آموزش و رفع تعلیق"
                              >
                                {lang === 'fa' ? 'اصلاح' : 'Coached'}
                              </button>
                            )}
                            <button
                              onClick={() => handleIssueWarning(brand.id)}
                              disabled={brand.warningsCount >= 4}
                              className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded text-[10px] transition cursor-pointer disabled:opacity-30"
                              title="صدور اخطار کتبی کیفی"
                            >
                              {lang === 'fa' ? 'اخطار' : 'Warn'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Supplier Security & Evaluation Matrix */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#e5b85a]" />
                <span>
                  {lang === 'fa' ? 'ارزیابی کیفیت زنجیره تامین' : 'Supply Chain Evaluation'}
                </span>
              </h3>
              <p className="text-[10px] text-white/50 leading-relaxed">
                {lang === 'fa'
                  ? 'طبق فصل پنجم آیین‌نامه، تامین‌کنندگانی که در ارزیابی امتیاز کمتر از ۷۵ کسب کنند، جهت حفظ اعتبار برندها فاقد صلاحیت هستند.'
                  : 'According to Article 15, any suppliers with score under 75 cannot enter the secure KARA ERP catalog.'}
              </p>

              <div className="space-y-3">
                {suppliers.map((s, idx) => (
                  <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5 hover:bg-white/[0.04] transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/90">{lang === 'fa' ? s.name : s.enName}</span>
                      <span className={`text-xs font-mono font-bold ${s.score >= 90 ? 'text-emerald-400' : s.score >= 80 ? 'text-[#e5b85a]' : 'text-amber-400'}`}>
                        {s.score} pt
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-white/45">
                      <span className="font-mono">Speed: {s.delivery}</span>
                      <span className="font-mono">Stability: {s.stability}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-1.5 text-[9px]">
                      <span>Quality: {'⭐'.repeat(s.quality)}</span>
                      <span>Price: {'⭐'.repeat(s.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Combined Recharts + drive files and sheet logger for CEO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recharts view */}
            <div className="glass-card rounded-2xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#e5b85a]" />
                {lang === 'fa' ? 'نمودار جریان درآمدی پلتفرم و حق‌العمل کارا' : 'Platform Financial Flow Chart'}
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="income" name={t.income} stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            </div>
          </>
        )}

            {/* CONTRACTS SUBTAB (BRAND PARTNERSHIPS & CONTRACTS) */}
            {ceoSubTab === 'contracts' && (
              <div className="space-y-6 animate-in fade-in duration-200 text-right">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left: Brand registration form */}
                  <div className="glass-card rounded-2xl p-5 space-y-4 lg:col-span-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'پیش‌ثبت‌نام برند همکار جدید' : 'Pre-Register New Brand'}</span>
                    </h3>
                    <p className="text-[10px] text-white/50 font-sans">
                      {lang === 'fa' ? 'ثبت مشخصات اولیه، اطلاعات تماس و میزان سرمایه ورودی برند جدید.' : 'Input name, email, phone and incoming capital details.'}
                    </p>

                    <form onSubmit={handleRegisterBrand} className="space-y-3 text-right">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'نام برند (فارسی):' : 'Brand Farsi Name:'}</label>
                        <input
                          type="text"
                          required
                          value={newBrandName}
                          onChange={(e) => setNewBrandName(e.target.value)}
                          placeholder="مثال: قالی‌بافی افغان‌باستانی"
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 text-right font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'نام برند (انگلیسی):' : 'Brand English Name:'}</label>
                        <input
                          type="text"
                          required
                          value={newBrandEnName}
                          onChange={(e) => setNewBrandEnName(e.target.value)}
                          placeholder="e.g. Afghan Rug Gallery"
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 text-left font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'نام مالک برند:' : 'Founder Name:'}</label>
                        <input
                          type="text"
                          required
                          value={newBrandOwner}
                          onChange={(e) => setNewBrandOwner(e.target.value)}
                          placeholder="مثال: صفی‌الله غزنوی"
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 text-right font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'دسته فعالیت کالاها:' : 'Category of Activity:'}</label>
                        <select
                          value={newBrandCategory}
                          onChange={(e) => setNewBrandCategory(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#1b0313] border border-white/10 text-white/80 focus:outline-none cursor-pointer"
                        >
                          <option value="مراقبت پوست">{lang === 'fa' ? 'مراقبت پوست' : 'Skincare'}</option>
                          <option value="عطر و ادکلن">{lang === 'fa' ? 'عطر و ادکلن' : 'Perfumes'}</option>
                          <option value="اکسسوری">{lang === 'fa' ? 'اکسسوری' : 'Accessories'}</option>
                          <option value="صنایع دستی">{lang === 'fa' ? 'صنایع دستی' : 'Handicrafts'}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'مشخصات و توصیف فعالیت:' : 'Activity Specs:'}</label>
                        <textarea
                          value={newBrandSpecs}
                          onChange={(e) => setNewBrandSpecs(e.target.value)}
                          placeholder="مثال: تولید پوشاک سنتی هراتی با الیاف نخی..."
                          rows={2}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 text-right font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'سرمایه ورودی برند (دلار):' : 'Capital Investment (USD):'}</label>
                        <input
                          type="number"
                          required
                          value={newBrandCapital}
                          onChange={(e) => setNewBrandCapital(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-right">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'ایمیل:' : 'Email:'}</label>
                          <input
                            type="email"
                            required
                            value={newBrandEmail}
                            onChange={(e) => setNewBrandEmail(e.target.value)}
                            placeholder="owner@brand.com"
                            className="w-full px-2 py-1.5 text-[10.5px] rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'تلفن تماس:' : 'Phone:'}</label>
                          <input
                            type="text"
                            required
                            value={newBrandPhone}
                            onChange={(e) => setNewBrandPhone(e.target.value)}
                            placeholder="0912..."
                            className="w-full px-2 py-1.5 text-[10.5px] rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer border border-[#e5b85a]/20 shadow transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#e5b85a]" />
                        <span>{lang === 'fa' ? 'ثبت و پیش‌نویس قرارداد' : 'Add & Draft Contract'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Center: Agreements & Signatures panel */}
                  <div className="glass-card rounded-2xl p-5 space-y-4 lg:col-span-2 flex flex-col justify-between">
                    <div className="space-y-4 text-right">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 gap-2">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <FileSignature className="w-4 h-4 text-[#e5b85a]" />
                          <span>{lang === 'fa' ? 'میز امضا و نهایی‌سازی قراردادهای تجاری کارا' : 'KARA Contract Signing & SLA Desk'}</span>
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/40">{lang === 'fa' ? 'انتخاب برند همکار:' : 'Select Brand:'}</span>
                          <select
                            value={selectedContractBrandId}
                            onChange={(e) => setSelectedContractBrandId(e.target.value)}
                            className="bg-black/40 border border-[#e5b85a]/30 text-[#e5b85a] font-bold py-1 px-3 rounded-lg text-xs focus:outline-none cursor-pointer font-mono"
                          >
                            {brands.map(b => (
                              <option key={b.id} value={b.id}>{lang === 'fa' ? b.name : b.enName}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Display active brand contract metadata */}
                      {(() => {
                        const b = brands.find(brand => brand.id === selectedContractBrandId);
                        if (!b) return null;
                        return (
                          <div className="space-y-4 animate-in fade-in duration-150 text-right">
                            {/* Metadata line */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-right">
                              <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl">
                                <span className="text-[9px] text-white/30 block">{lang === 'fa' ? 'صاحب امتیاز:' : 'Owner:'}</span>
                                <span className="text-xs font-bold text-white/80">{b.owner}</span>
                              </div>
                              <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-right">
                                <span className="text-[9px] text-white/30 block">{lang === 'fa' ? 'سرمایه فعال:' : 'Active Capital:'}</span>
                                <span className="text-xs font-bold text-[#e5b85a] font-mono">${b.capital.toLocaleString()} ({b.capitalTier})</span>
                              </div>
                              <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-right">
                                <span className="text-[9px] text-white/30 block">{lang === 'fa' ? 'شناسه برند:' : 'Brand ID:'}</span>
                                <span className="text-xs font-bold text-rose-300 font-mono">{b.id.toUpperCase()}</span>
                              </div>
                              <div className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-right">
                                <span className="text-[9px] text-white/30 block">{lang === 'fa' ? 'وضعیت حقوقی:' : 'Legal Status:'}</span>
                                <span className={`text-[10.5px] font-bold block ${
                                  b.contractStatus === 'fully_signed' ? 'text-emerald-400' :
                                  b.contractStatus === 'ceo_signed' ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {b.contractStatus === 'fully_signed' ? (lang === 'fa' ? '✓ قرارداد رسمی نافذ' : 'Fully Certified') :
                                   b.contractStatus === 'ceo_signed' ? (lang === 'fa' ? '✍️ امضا شده مدیریت' : 'Pending Owner Signature') :
                                   (lang === 'fa' ? '🔴 پیش‌نویس اولیه' : 'Draft')}
                                </span>
                              </div>
                            </div>

                            {/* Contract text content */}
                            <div className="p-4 bg-[#100109] border border-[#e5b85a]/15 rounded-2xl space-y-3 max-h-[190px] overflow-y-auto font-sans leading-relaxed text-xs text-white/80 text-justify">
                              <p className="font-bold border-b border-white/5 pb-1 text-[#e5b85a] text-center">
                                {lang === 'fa' ? 'متن توافق‌نامه همکاری و آیین‌نامه انضباطی زنجیره کارا' : 'KARA ERP Commercial Partnership Charter'}
                              </p>
                              <p className="text-[10.5px]">
                                {b.contractText || `این قرارداد فی‌مابین هلدینگ زنجیره‌ای کارا و برند همکار ${b.name} به نمایندگی خانم/آقای ${b.owner} جهت عرضه کالاها در بازارهای زنجیره‌ای افغان منعقد می‌گردد. طرفین ملزم به تبعیت کامل از آیین‌نامه انضباطی کیفی، پایداری انبارداری کاتالوگ و ارزیابی امتیازات بر مبنای رضایت مشتریان هستند.`}
                              </p>
                              <p className="text-[10px] text-white/40 border-t border-white/5 pt-1.5">
                                {lang === 'fa'
                                  ? '* تذکر انضباطی: صدور ۴ اخطار کتبی توسط کارشناسان بازرسی به معنی تعلیق خودکار ورود به پنل و غیرفعال شدن کاتالوگ کالا است.'
                                  : '* Penalty Clause: Four active citations from the Supervision Board will auto-suspend catalog availability.'}
                              </p>
                            </div>

                            {/* Signatures Actions Section */}
                            <div className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-3">
                              <button
                                onClick={() => handleSignContract(b.id, 'ceo')}
                                disabled={b.contractStatus === 'ceo_signed' || b.contractStatus === 'fully_signed'}
                                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#e5b85a]/15 hover:bg-[#e5b85a]/25 border border-[#e5b85a]/30 text-[#e5b85a] transition active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <FileSignature className="w-4 h-4" />
                                <span>{lang === 'fa' ? '۱. امضای قرارداد (مدیریت ارشد)' : '1. Sign as CEO Admin'}</span>
                              </button>

                              <button
                                onClick={() => handleSignContract(b.id, 'brand_owner')}
                                disabled={b.contractStatus === 'fully_signed'}
                                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <FileSignature className="w-4 h-4" />
                                <span>{lang === 'fa' ? '۲. شبیه‌سازی امضای مالک برند' : '2. Simulate Owner Signature'}</span>
                              </button>
                            </div>

                            {/* Access links generator widget */}
                            <div className="mt-4 p-4 bg-white/[0.02] border border-[#e5b85a]/15 rounded-2xl space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-xs font-bold text-white block">{lang === 'fa' ? 'تولید لینک ورود اختصاصی و توکن دسترسی ویژه' : 'Secure Special Access Token Desk'}</span>
                                  <span className="text-[10px] text-white/40 block mt-0.5">
                                    {lang === 'fa' ? 'پس از امضای دو طرف، لینک دسترسی منحصربه‌فرد را جهت توزیع صادر کنید.' : 'Generate a custom login token for the partner.'}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={() => handleGenerateBrandLink(b.id)}
                                  disabled={b.contractStatus !== 'fully_signed'}
                                  className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 disabled:opacity-30 cursor-pointer transition flex items-center gap-1.5"
                                >
                                  <Link className="w-3.5 h-3.5" />
                                  <span>{lang === 'fa' ? 'تولید لینک اختصاصی' : 'Generate Token'}</span>
                                </button>
                              </div>

                              {b.accessLink && (
                                <div className="p-3 bg-black/40 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between font-mono animate-in slide-in-from-bottom-1 gap-2 text-right">
                                  <div className="overflow-hidden mr-2 text-right">
                                    <span className="text-[10px] text-emerald-400 block font-bold">{lang === 'fa' ? 'لینک دسترسی امن صادر شده:' : 'Issued special access URL:'}</span>
                                    <span className="text-[10.5px] text-white/70 select-all truncate block">
                                      https://kara-erp.local/?role=brand&token={b.accessLink}
                                    </span>
                                  </div>
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`https://kara-erp.local/?role=brand&token=${b.accessLink}`);
                                        alert(lang === 'fa' ? 'لینک ویژه در حافظه موقت کپی شد!' : 'Copied special URL to clipboard!');
                                      }}
                                      className="p-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs"
                                      title="کپی کردن لینک"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setActiveBrandSession(b.id);
                                        setSelectedFounderBrandId(b.id);
                                        setActiveRole('brand');
                                        alert(lang === 'fa' ? `ورود شبیه‌سازی شد! پنل برند "${b.name}" باز گردید.` : `Simulating link entry! Logged into ${b.enName}.`);
                                      }}
                                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1"
                                      title="ورود مستقیم به حساب برند"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      <span className="text-[9px]">{lang === 'fa' ? 'ورود مستقیم' : 'Launch'}</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EMPLOYEES SUBTAB (STAFF HIRING & ACCESS LINKS) */}
            {ceoSubTab === 'employees' && (
              <div className="space-y-6 animate-in fade-in duration-200 text-right">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left: Employee Hiring & Contract Specs Input form */}
                  <div className="glass-card rounded-2xl p-5 space-y-4 lg:col-span-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'ثبت استخدام کارمند جدید' : 'Register New Staff'}</span>
                    </h3>
                    <p className="text-[10px] text-white/50 font-sans">
                      {lang === 'fa' ? 'اطلاعات اولیه، واحد کاری و شرایط تایید قرارداد کاری پرسنل جدید.' : 'Input name, department, base salary and work hours details.'}
                    </p>

                    <form onSubmit={handleRegisterEmployee} className="space-y-3 text-right">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'نام کامل کارمند:' : 'Employee Full Name:'}</label>
                        <input
                          type="text"
                          required
                          value={newEmpName}
                          onChange={(e) => setNewEmpName(e.target.value)}
                          placeholder="مثال: شاه‌محمود احمدی"
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 text-right font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'آدرس ایمیل پرسنل:' : 'Email Address:'}</label>
                        <input
                          type="email"
                          required
                          value={newEmpEmail}
                          onChange={(e) => setNewEmpEmail(e.target.value)}
                          placeholder="mahmood@kara.com"
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'تلفن همراه پرسنل:' : 'Mobile Phone:'}</label>
                        <input
                          type="text"
                          required
                          value={newEmpPhone}
                          onChange={(e) => setNewEmpPhone(e.target.value)}
                          placeholder="0912..."
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'تخصیص واحد کاری / دپارتمان:' : 'Assigned Department:'}</label>
                        <select
                          value={newEmpDept}
                          onChange={(e) => setNewEmpDept(e.target.value as any)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#1b0313] border border-white/10 text-white/80 focus:outline-none cursor-pointer"
                        >
                          <option value="branding">{lang === 'fa' ? 'بخش برندینگ و کاتالوگ 🎨' : 'Branding Dept 🎨'}</option>
                          <option value="supervision">{lang === 'fa' ? 'بخش نظارت و سلامت 🛡️' : 'Supervision Dept 🛡️'}</option>
                          <option value="finance">{lang === 'fa' ? 'بخش مالی و پردازش 💳' : 'Finance Dept 💳'}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'حقوق ماهیانه پیشنهادی (ریال):' : 'Monthly Base Salary (IRR):'}</label>
                        <input
                          type="number"
                          required
                          value={newEmpSalary}
                          onChange={(e) => setNewEmpSalary(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 block">{lang === 'fa' ? 'ساعات کاری هفتگی:' : 'Weekly Working Hours:'}</label>
                        <input
                          type="number"
                          required
                          value={newEmpHours}
                          onChange={(e) => setNewEmpHours(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/50 font-mono text-center"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#9d1c52] to-[#c22d6d] text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer border border-[#e5b85a]/20 shadow transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#e5b85a]" />
                        <span>{lang === 'fa' ? 'ثبت استخدام کارمند' : 'Add Staff to Registry'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Right: Interactive Employees directory with Approval & Access link generator */}
                  <div className="glass-card rounded-2xl p-5 space-y-4 lg:col-span-2">
                    <div className="border-b border-white/5 pb-2.5 text-right">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#e5b85a]" />
                        <span>{lang === 'fa' ? 'دفتر ثبت پرسنل و بازبینی تایید قرارداد کاری کارا' : 'Staff Registry & Work Contract Verification'}</span>
                      </h3>
                      <p className="text-[10px] text-white/50 mt-1 font-sans">
                        {lang === 'fa' ? 'مدیریت ارشد باید قرارداد کارمندان را تایید کند تا لینک دسترسی ویژه صادر شود.' : 'Review contract parameters, approve employment status, and generate login link.'}
                      </p>
                    </div>

                    <div className="overflow-x-auto text-right">
                      <table className="w-full text-right text-xs text-right">
                        <thead>
                          <tr className="border-b border-white/5 text-white/40 font-medium text-right">
                            <th className="pb-3 text-right">{lang === 'fa' ? 'مشخصات پرسنل' : 'Employee details'}</th>
                            <th className="pb-3 text-center">{lang === 'fa' ? 'دپارتمان' : 'Department'}</th>
                            <th className="pb-3 text-center">{lang === 'fa' ? 'ساعات کاری' : 'SLA Hours'}</th>
                            <th className="pb-3 text-center">{lang === 'fa' ? 'حقوق ماهیانه' : 'Salary'}</th>
                            <th className="pb-3 text-center">{lang === 'fa' ? 'وضعیت قرارداد' : 'Contract Status'}</th>
                            <th className="pb-3 text-center">{lang === 'fa' ? 'عملیات و پیوند ورود' : 'Actions & Login URL'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-semibold text-right">
                          {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-white/[0.01] transition">
                              <td className="py-3 text-right">
                                <span className="text-white block font-bold font-sans">{emp.name}</span>
                                <span className="text-[10px] text-white/40 font-normal block font-mono">{emp.email} • {emp.phone}</span>
                              </td>
                              <td className="py-3 text-center">
                                <span className="px-2 py-0.5 rounded bg-white/5 text-white/80 text-[10px] font-mono font-bold">
                                  {emp.department === 'branding' ? 'Branding' : emp.department === 'supervision' ? 'Supervision' : 'Finance'}
                                </span>
                              </td>
                              <td className="py-3 text-center font-mono text-white/80">{emp.workingHours}h/wk</td>
                              <td className="py-3 text-center font-mono text-emerald-400">{emp.salary.toLocaleString()} ریال</td>
                              <td className="py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  emp.status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                                }`}>
                                  {emp.status === 'approved' ? (lang === 'fa' ? '✓ تایید و امضا شد' : 'Approved') : (lang === 'fa' ? '🔴 در انتظار تایید' : 'Pending CEO')}
                                </span>
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex flex-col items-center gap-1.5 justify-center">
                                  {emp.status === 'pending_approval' && (
                                    <button
                                      onClick={() => handleApproveEmployeeContract(emp.id)}
                                      className="py-1 px-2.5 text-[10px] font-bold bg-[#e5b85a]/20 hover:bg-[#e5b85a]/30 border border-[#e5b85a]/30 text-[#e5b85a] rounded-md cursor-pointer transition"
                                    >
                                      {lang === 'fa' ? '✍️ تایید و امضای قرارداد پرسنل' : 'Approve Contract'}
                                    </button>
                                  )}

                                  {emp.status === 'approved' && !emp.accessLink && (
                                    <button
                                      onClick={() => handleGenerateEmployeeLink(emp.id)}
                                      className="py-1 px-2.5 text-[10px] font-bold bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/20 text-purple-300 rounded-md cursor-pointer transition flex items-center gap-1"
                                    >
                                      <Link className="w-3 h-3" />
                                      <span>{lang === 'fa' ? '🔗 صدور لینک ورود اختصاصی' : 'Generate Link'}</span>
                                    </button>
                                  )}

                                  {emp.accessLink && (
                                    <div className="flex items-center gap-1 font-mono">
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(`https://kara-erp.local/?role=ops&token=${emp.accessLink}`);
                                          alert(lang === 'fa' ? 'لینک ورود کارمند کپی شد!' : 'Employee Login URL copied!');
                                        }}
                                        className="p-1 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-white/60 text-xs"
                                        title="کپی کردن لینک"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setActiveEmployeeSession(emp.id);
                                          setOpsSubTab(emp.department as any);
                                          setActiveRole('ops');
                                          alert(lang === 'fa' ? `ورود شبیه‌سازی شد! پنل دپارتمان ${emp.department.toUpperCase()} باز گردید.` : `Simulated employee launch! Opened ${emp.department.toUpperCase()} dashboard.`);
                                        }}
                                        className="py-1 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded text-[9.5px] font-bold transition flex items-center gap-1"
                                        title="ورود مستقیم به حساب کارمند"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>{lang === 'fa' ? 'ورود مستقیم' : 'Launch'}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* ⚙️ PERSPECTIVE 2: OPERATIONS & BRAND SUCCESS TEAM */}
      {/* ========================================================================= */}
      {activeRole === 'ops' && (
        !activeEmployeeSession ? (
          renderLoginGate('ops')
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Executive Sub-tab Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1b0313]/95 p-3 border border-[#e5b85a]/25 rounded-2xl">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#e5b85a] font-bold block">
                    {lang === 'fa' ? 'انتخاب واحد اجرایی و نظارتی کارا (۳ بخش تخصصی):' : 'Select Operational Department (3 Specializations):'}
                  </span>
                  {(() => {
                    const activeEmp = employees.find(e => e.id === activeEmployeeSession);
                    return activeEmp ? (
                      <div className="flex items-center gap-1.5 text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5 font-sans">
                        <span className="text-white/40">{lang === 'fa' ? 'پرسنل:' : 'Staff:'}</span>
                        <span className="text-emerald-300 font-bold">{activeEmp.name}</span>
                        <button
                          onClick={() => {
                            setActiveEmployeeSession(null);
                            setLoginCredential('');
                            setLoginToken('');
                          }}
                          className="px-1.5 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded cursor-pointer transition text-[8px]"
                        >
                          {lang === 'fa' ? 'خروج' : 'Logout'}
                        </button>
                      </div>
                    ) : null;
                  })()}
                </div>
                <p className="text-[10px] text-white/50 mt-1">
                  {lang === 'fa' ? 'کارمندان کارا جهت تسریع امور بر اساس تفکیک وظایف زیر اقدام می‌نمایند.' : 'Operational tasks are strictly divided between branding, supervision, and finance.'}
                </p>
              </div>
            <div className="flex flex-wrap bg-[#0c0008] p-1 border border-white/5 rounded-xl gap-1 text-[11px] font-bold">
              <button
                onClick={() => setOpsSubTab('branding')}
                className={`px-3 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 ${opsSubTab === 'branding' ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/20 shadow' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <span>🎨 {lang === 'fa' ? 'واحد برندینگ' : 'Branding'}</span>
              </button>
              <button
                onClick={() => setOpsSubTab('supervision')}
                className={`px-3 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 ${opsSubTab === 'supervision' ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/20 shadow' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <span>🛡️ {lang === 'fa' ? 'واحد نظارت و کیفیت' : 'Supervision'}</span>
              </button>
              <button
                onClick={() => setOpsSubTab('finance')}
                className={`px-3 py-2 rounded-lg cursor-pointer transition flex items-center gap-1 ${opsSubTab === 'finance' ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/20 shadow' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <span>💳 {lang === 'fa' ? 'واحد مالی و تسویه' : 'Finance'}</span>
              </button>
            </div>
          </div>

          {/* ==================== SUB-TAB 1: BRANDING & SKU CREATION ==================== */}
          {opsSubTab === 'branding' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Register Products */}
                <div className="glass-card rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-[#e5b85a] flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'ثبت و تعریف کالای جدید برای شرکای تجاری (کد کاتالوگ)' : 'Register New Brand Product SKU'}</span>
                    </h3>
                    <p className="text-[10px] text-white/50 mt-1">
                      {lang === 'fa'
                        ? 'نام کالا، مشخصات، قیمت خرید اولیه، قیمت فروش نهایی و موجودی فیزیکی در انبار مرکزی را ثبت کنید.'
                        : 'Submit specifications, wholesale buy rate, client sell price, and initial count for any brand.'}
                    </p>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-semibold text-white/90">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Brand Select */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۱. برند همکار مربوطه' : '1. Target Partner Brand'}</label>
                        <select
                          value={regBrandId}
                          onChange={(e) => setRegBrandId(e.target.value)}
                          className="w-full bg-[#1b0313] border border-white/10 rounded-xl p-2.5 text-[#e5b85a] focus:outline-none focus:border-[#e5b85a]/40"
                        >
                          {brands.map(b => (
                            <option key={b.id} value={b.id}>{lang === 'fa' ? b.name : b.enName}</option>
                          ))}
                        </select>
                      </div>

                      {/* Category Select */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۲. دسته‌بندی کالا' : '2. SKU Category'}</label>
                        <select
                          value={regCategory}
                          onChange={(e) => setRegCategory(e.target.value)}
                          className="w-full bg-[#1b0313] border border-white/10 rounded-xl p-2.5 text-white/80 focus:outline-none"
                        >
                          <option value="مراقبت پوست">{lang === 'fa' ? 'مراقبت پوست (Skincare)' : 'Skincare'}</option>
                          <option value="عطر و ادکلن">{lang === 'fa' ? 'عطر و ادکلن (Perfume)' : 'Perfumes'}</option>
                          <option value="صنایع دستی">{lang === 'fa' ? 'صنایع دستی (Handmades)' : 'Handmades'}</option>
                          <option value="اکسسوری">{lang === 'fa' ? 'اکسسوری (Accessories)' : 'Accessories'}</option>
                        </select>
                      </div>

                      {/* Name FA */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۳. نام کالا (فارسی)' : '3. Product Name (Farsi)'}</label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: ریمل مژه حجم دهنده مکس"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>

                      {/* Name EN */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۴. نام کالا (انگلیسی)' : '4. Product Name (English)'}</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Max Volume Lashes Mascara"
                          value={regEnName}
                          onChange={(e) => setRegEnName(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white placeholder-white/20 focus:outline-none text-left font-mono"
                        />
                      </div>

                      {/* Buy Price */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۵. قیمت خرید به تامین‌کننده (ریال)' : '5. Wholesale Buy Rate (IRR)'}</label>
                        <input
                          type="number"
                          required
                          value={regPriceBuy}
                          onChange={(e) => setRegPriceBuy(Number(e.target.value))}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                        />
                      </div>

                      {/* Sell Price */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۶. قیمت فروش به مصرف‌کننده (ریال)' : '6. Consumer Sell Price (IRR)'}</label>
                        <input
                          type="number"
                          required
                          value={regPriceSell}
                          onChange={(e) => setRegPriceSell(Number(e.target.value))}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-[#e5b85a] focus:outline-none font-mono"
                        />
                      </div>

                      {/* Stock */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۷. موجودی اولیه انبار مرکزی (تعداد)' : '7. Initial Stock Count (Units)'}</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={regStock}
                          onChange={(e) => setRegStock(Number(e.target.value))}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                        />
                      </div>

                      {/* Image Preset / Choice */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۸. تصویر نمونه کالا' : '8. Product Image Asset'}</label>
                        <select
                          value={regImage}
                          onChange={(e) => setRegImage(e.target.value)}
                          className="w-full bg-[#1b0313] border border-white/10 rounded-xl p-2.5 text-white/80 focus:outline-none"
                        >
                          <option value="">{lang === 'fa' ? '✨ انتخاب تصویر هوشمند پیش‌فرض' : '✨ Use Smart Preset Image'}</option>
                          <option value="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60">🧴 {lang === 'fa' ? 'پوستی / لوسیون سفید' : 'Skincare White Lotion'}</option>
                          <option value="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=60">🧪 {lang === 'fa' ? 'قطره‌چکان شیشه‌ای کهربایی' : 'Amber Glass Dropper'}</option>
                          <option value="https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&auto=format&fit=crop&q=60">🧴 {lang === 'fa' ? 'عطر جیبی شیک' : 'Pocket Perfume Bottle'}</option>
                          <option value="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=150&auto=format&fit=crop&q=60">💎 {lang === 'fa' ? 'عطر شیشه‌ای مجلل' : 'Luxury Crystal Scent'}</option>
                          <option value="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60">👜 {lang === 'fa' ? 'کیف کلاچ لوکس' : 'Luxury Handbag'}</option>
                          <option value="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=60">👗 {lang === 'fa' ? 'لباس سنتی دست‌دوز' : 'Traditional Gown'}</option>
                        </select>
                      </div>

                      {/* Color Specs */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۹. مشخصه رنگ / نوع رایحه' : '9. Spec Color / Scent Type'}</label>
                        <input
                          type="text"
                          placeholder="مثلاً: رز صورتی، مشکی مات"
                          value={regSpecsColor}
                          onChange={(e) => setRegSpecsColor(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>

                      {/* Size Specs */}
                      <div className="space-y-1">
                        <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۱۰. مشخصه سایز / حجم (میلی‌لیتر)' : '10. Spec Size / Volume (ml)'}</label>
                        <input
                          type="text"
                          placeholder="مثلاً: ۵۰ میلی‌لیتر، فری‌سایز"
                          value={regSpecsSize}
                          onChange={(e) => setRegSpecsSize(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-white/60 text-[10px] block">{lang === 'fa' ? '۱۱. توضیحات تکمیلی کالا (جهت جذب مشتری)' : '11. SKU Description & Marketing Text'}</label>
                      <textarea
                        rows={2}
                        placeholder={lang === 'fa' ? 'این کالا با بهترین مواد اولیه وارداتی تولید شده است...' : 'Describe key benefits...'}
                        value={regDesc}
                        onChange={(e) => setRegDesc(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-white placeholder-white/20 focus:outline-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#e5b85a] hover:bg-[#c29c48] text-black font-black text-xs rounded-xl cursor-pointer transition shadow"
                    >
                      {lang === 'fa' ? '✓ ثبت رسمی کالا در سیستم مرکزی کارا' : '✓ REGISTER OFFICIAL SKU IN CENTRAL SYSTEM'}
                    </button>
                  </form>
                </div>

                {/* Right Panel: Active Brand SKU Catalog Preview */}
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#e5b85a]" />
                    <span>
                      {lang === 'fa' ? 'بازرسی کاتالوگ و گارانتی برندها' : 'Brand SKU Quick Auditing'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    {lang === 'fa'
                      ? 'تمامی کالاهای تعریف شده همراه با تصاویر، جزئیات قیمتی و موجودی اولیه در زیر قابل مشاهده است.'
                      : 'Review current active catalog lists across all registered brands.'}
                  </p>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {Object.entries(products).map(([brId, listVal]) => {
                      const list = listVal as ProductSKU[];
                      const matchedB = brands.find(b => b.id === brId);
                      return (
                        <div key={brId} className="space-y-2 border-b border-white/5 pb-2.5">
                          <span className="text-[10px] text-[#e5b85a] font-bold block">🏢 {matchedB ? (lang === 'fa' ? matchedB.name : matchedB.enName) : brId}</span>
                          <div className="space-y-2">
                            {list.map(p => (
                              <div key={p.id} className="flex gap-2 p-2 bg-white/[0.01] border border-white/5 rounded-lg text-[10.5px]">
                                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-white/10" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/90 font-bold truncate">{lang === 'fa' ? p.name : p.enName}</p>
                                  <p className="text-white/40 text-[9px] truncate">
                                    {lang === 'fa' ? `خرید: ${p.priceBuy.toLocaleString()} • فروش: ${p.priceSell.toLocaleString()}` : `Buy: ${p.priceBuy} • Sell: ${p.priceSell}`}
                                  </p>
                                  <p className="text-emerald-400 font-mono text-[9px]">
                                    {lang === 'fa' ? `موجودی: ${p.stock} عدد` : `Stock: ${p.stock} units`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 2: SUPERVISION & CHECKLISTS ==================== */}
          {opsSubTab === 'supervision' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Interactive Checklist */}
                <div className="glass-card rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'چک‌لیست نظارت روزانه کارشناسان کارا (صفحه ۱۰۳)' : 'KARA Operational Daily Checklists'}</span>
                    </h3>
                    <p className="text-[10px] text-white/50 mt-1">
                      {lang === 'fa'
                        ? 'کنترل گام‌های کیفی به صورت روزانه جهت حفظ استانداردهای بازار الزامی است.'
                        : 'Daily audits to ensure compliance with KARA marketplace standards.'}
                    </p>
                  </div>

                  {/* SECTION: MORNING */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#e5b85a] font-bold block border-b border-[#e5b85a]/15 pb-1">
                      🌅 {lang === 'fa' ? 'چک‌لیست صبحگاهی (هر روز صبح)' : 'Morning Tasks (SLA Check)'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {checklist.filter(c => c.section === 'morning').map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-right cursor-pointer transition ${
                            item.done 
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200 line-through' 
                              : 'bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <input type="checkbox" checked={item.done} readOnly className="accent-[#e5b85a] rounded" />
                          <span className="text-xs font-semibold">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION: AFTERNOON */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#e5b85a] font-bold block border-b border-[#e5b85a]/15 pb-1">
                      ☀️ {lang === 'fa' ? 'چک‌لیست بعد از ظهر' : 'Afternoon Audit Tasks'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {checklist.filter(c => c.section === 'afternoon').map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-right cursor-pointer transition ${
                            item.done 
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200 line-through' 
                              : 'bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <input type="checkbox" checked={item.done} readOnly className="accent-[#e5b85a] rounded" />
                          <span className="text-xs font-semibold">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION: EVENING */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#e5b85a] font-bold block border-b border-[#e5b85a]/15 pb-1">
                      🌙 {lang === 'fa' ? 'چک‌لیست عصرگاهی و تسویه حساب' : 'Evening Settlement & Reports'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {checklist.filter(c => c.section === 'evening').map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-right cursor-pointer transition ${
                            item.done 
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200 line-through' 
                              : 'bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <input type="checkbox" checked={item.done} readOnly className="accent-[#e5b85a] rounded" />
                          <span className="text-xs font-semibold">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Operational KPI Metrics & Supply chain quality */}
                <div className="space-y-6">
                  {/* Quality Audit KPIs */}
                  <div className="glass-card rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'شاخص‌های بهداشت و ایمنی' : 'Quality Assurance KPIs'}</span>
                    </h3>
                    <div className="space-y-3 font-semibold text-xs">
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5">
                        <div className="flex justify-between">
                          <span>{lang === 'fa' ? 'نرخ پاس شدن استانداردهای بهداشت' : 'Sanitary Audit Pass Rate'}</span>
                          <span className="text-emerald-400 font-mono">98.5%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[98.5%]"></div>
                        </div>
                      </div>

                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5">
                        <div className="flex justify-between">
                          <span>{lang === 'fa' ? 'زمان نهایی بازرسی تا بارگیری (SLA)' : 'Inspection turnaround time'}</span>
                          <span className="text-[#e5b85a] font-mono">1.2 {lang === 'fa' ? 'روز' : 'days'}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#e5b85a] h-full w-[85%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supply Chain Suppliers Matrix */}
                  <div className="glass-card rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'ارزیابی کیفیت زنجیره تامین' : 'Supply Chain Evaluation'}</span>
                    </h3>
                    <div className="space-y-3">
                      {suppliers.map((s, idx) => (
                        <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5 hover:bg-white/[0.04] transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white/90">{lang === 'fa' ? s.name : s.enName}</span>
                            <span className={`text-xs font-mono font-bold ${s.score >= 90 ? 'text-emerald-400' : s.score >= 80 ? 'text-[#e5b85a]' : 'text-amber-400'}`}>
                              {s.score} pt
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-white/45">
                            <span className="font-mono">Speed: {s.delivery}</span>
                            <span className="font-mono">Stability: {s.stability}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-white/5 pt-1.5 text-[9px]">
                            <span>Quality: {'⭐'.repeat(s.quality)}</span>
                            <span>Price: {'⭐'.repeat(s.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brands Warnings Management Table (from lines 1040-1090) */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#e5b85a]" />
                      <span>{lang === 'fa' ? 'مکانیزم نظارتی کارا: مدیریت سلامت و اخطارهای کتبی برندها' : 'KARA Active Regulation Desk: Partner Sanctions'}</span>
                    </h3>
                    <p className="text-[10px] text-white/50 mt-1">
                      {lang === 'fa' ? 'جهت حفظ کیفیت، کارشناس نظارت در صورت مشاهده نقض قوانین (تاخیر ارسال، لغو مکرر) اخطار صادر می‌کند.' : 'Monitor warnings, issue citations and conduct retraining programs.'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 font-medium">
                        <th className="pb-3 text-right">{lang === 'fa' ? 'نام برند همکار' : 'Brand Name'}</th>
                        <th className="pb-3">{lang === 'fa' ? 'بنیان‌گذار' : 'Founder'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'امتیاز سلامت' : 'Health Score'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'رده کیفی' : 'Quality Tier'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'وضعیت اخطار' : 'Warning Level'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'اقدامات کارشناس' : 'Specialist Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {brands.map((brand) => (
                        <tr key={brand.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3">
                            <span className="text-white/90 block">{lang === 'fa' ? brand.name : brand.enName}</span>
                            <span className="text-[#e5b85a]/70 text-[10px] block font-mono">{brand.id.toUpperCase()}</span>
                          </td>
                          <td className="py-3 text-white/60">{brand.owner}</td>
                          <td className="py-3 text-center font-mono">
                            <span className={brand.score >= 90 ? 'text-emerald-400' : brand.score >= 75 ? 'text-[#e5b85a]' : 'text-rose-400'}>
                              {brand.score} / 100
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                              brand.tier === 'Golden' || brand.tier === 'Diamond' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' :
                              brand.tier === 'Mumtaz' ? 'bg-purple-500/10 border border-purple-500/30 text-purple-300' :
                              brand.tier === 'Standard' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' :
                              'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                            }`}>
                              {lang === 'fa' ? brand.tier : brand.enTier}
                            </span>
                          </td>
                          <td className="py-3 text-center font-mono">
                            {brand.warningsCount > 0 ? (
                              <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                {brand.warningsCount} {lang === 'fa' ? 'اخطار' : 'Warnings'}
                              </span>
                            ) : (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {lang === 'fa' ? 'بدون خطا' : 'No alerts'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {brand.warningsCount > 0 && (
                                <button
                                  onClick={() => handleClearWarnings(brand.id)}
                                  className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded text-[10px] transition cursor-pointer"
                                  title="آموزش و رفع تعلیق"
                                >
                                  {lang === 'fa' ? 'اصلاح' : 'Coached'}
                                </button>
                              )}
                              <button
                                onClick={() => handleIssueWarning(brand.id)}
                                disabled={brand.warningsCount >= 4}
                                className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded text-[10px] transition cursor-pointer disabled:opacity-30"
                                title="صدور اخطار کتبی کیفی"
                              >
                                {lang === 'fa' ? 'اخطار' : 'Warn'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 3: FINANCE & SETTLEMENT ==================== */}
          {opsSubTab === 'finance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Active customer order desk */}
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#e5b85a]" />
                    <span>{lang === 'fa' ? 'میز کار پردازش سفارشات آنلاین مشتریان' : 'E-Commerce Order Processing Desk'}</span>
                  </h3>
                  <p className="text-[10px] text-white/50 mt-1">
                    {lang === 'fa' ? 'فرایند تغییر وضعیت فاکتورها، ارسال پیک هوایی و بسته‌بندی برای لجر سفارشات.' : 'Process paid transactions, pack items, and dispatch courier runs.'}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 font-medium">
                        <th className="pb-3 text-right">{lang === 'fa' ? 'شناسه / خریدار' : 'Order ID / Buyer'}</th>
                        <th className="pb-3">{lang === 'fa' ? 'کالای خریداری شده' : 'Purchased SKU'}</th>
                        <th className="pb-3">{lang === 'fa' ? 'برند مرجع' : 'Merchant Brand'}</th>
                        <th className="pb-3">{lang === 'fa' ? 'مبلغ نهایی' : 'Amount'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'وضعیت ارسال' : 'Shipping Status'}</th>
                        <th className="pb-3 text-center">{lang === 'fa' ? 'تغییر وضعیت نهایی (SLA)' : 'Change status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3">
                            <span className="font-mono text-[#e5b85a] block">{o.id}</span>
                            <span className="text-white/60">{o.customerName}</span>
                          </td>
                          <td className="py-3 text-white/90">{o.item}</td>
                          <td className="py-3 text-rose-300">{o.brandName}</td>
                          <td className="py-3 font-mono">{o.amount.toLocaleString()} ریال</td>
                          <td className="py-3 text-center">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] ${
                              o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25' :
                              o.status === 'shipped' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25' :
                              o.status === 'preparing' ? 'bg-[#e5b85a]/10 text-[#e5b85a] border border-[#e5b85a]/25' :
                              'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                            }`}>
                              {o.status === 'delivered' ? '✓ تحویل شد' :
                               o.status === 'shipped' ? '🚚 در مسیر پیک' :
                               o.status === 'preparing' ? '📦 در حال بسته‌بندی' :
                               '💳 پرداخت شده (جدید)'}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {o.status === 'paid' && (
                                <button
                                  onClick={() => handleTransitionOrderStatus(o.id, 'preparing')}
                                  className="px-2 py-1 text-[10px] font-bold bg-[#9d1c52]/10 hover:bg-[#9d1c52]/20 border border-[#e5b85a]/20 text-[#e5b85a] rounded-lg transition"
                                >
                                  بسته‌بندی
                                </button>
                              )}
                              {o.status === 'preparing' && (
                                <button
                                  onClick={() => handleTransitionOrderStatus(o.id, 'shipped')}
                                  className="px-2 py-1 text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg transition"
                                >
                                  ارسال پیک
                                </button>
                              )}
                              {o.status === 'shipped' && (
                                <button
                                  onClick={() => handleTransitionOrderStatus(o.id, 'delivered')}
                                  className="px-2 py-1 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg transition"
                                >
                                  تحویل نهایی
                                </button>
                              )}
                              {o.status !== 'delivered' && (
                                <button
                                  onClick={() => handleTransitionOrderStatus(o.id, 'cancelled')}
                                  className="px-2 py-1 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 rounded-lg transition"
                                >
                                  لغو
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* 👩‍💼 PERSPECTIVE 3: BRAND FOUNDER MANAGEMENT PANEL */}
      {/* ========================================================================= */}
      {activeRole === 'brand' && (
        !activeBrandSession ? (
          renderLoginGate('brand')
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Brand Switcher and Basic Info */}
            <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#e5b85a]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#9d1c52] to-[#c22d6d] border border-[#e5b85a]/40 rounded-2xl flex items-center justify-center font-bold text-white shadow shadow-[#9d1c52]/10 text-lg">
                  👩‍💼
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px]">{lang === 'fa' ? 'پنل فعال برند شریک:' : 'Active Partner Brand Panel:'}</span>
                    <span className="text-[#e5b85a] font-black text-xs md:text-sm bg-[#1b0313] px-3 py-1 border border-[#e5b85a]/30 rounded-xl">
                      {lang === 'fa' ? founderBrand.name : founderBrand.enName}
                    </span>
                    <button
                      onClick={() => {
                        setActiveBrandSession(null);
                        setLoginCredential('');
                        setLoginToken('');
                      }}
                      className="mr-2 px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg cursor-pointer transition text-[9px] font-bold font-sans"
                    >
                      {lang === 'fa' ? 'خروج از حساب' : 'Log Out'}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">
                    {lang === 'fa' 
                      ? `بنیان‌گذار: ${founderBrand.owner} • تاریخ تاسیس: ${founderBrand.joinedDate}`
                      : `Founder: ${founderBrand.owner} • Onboarding Date: ${founderBrand.joinedDate}`
                    }
                  </p>
                </div>
              </div>

            {/* Loyalty & Tier Badge */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3">
              <Award className="w-8 h-8 text-[#e5b85a]" />
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-white/40">{lang === 'fa' ? 'رتبه بهداشت برند' : 'Brand Health Rating'}</span>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[#e5b85a] font-black">{founderBrand.tier}</span>
                  <span className="text-[10px] font-mono text-emerald-400">({founderBrand.score} pts)</span>
                </p>
              </div>
            </div>
          </div>

          {/* DYNAMIC METERS & HEALTH METRIC CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: 4-Dimensional Score Card (Article 7 & 10) */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2 text-[#e5b85a]">
                📊 {lang === 'fa' ? 'شاخص‌های چهارگانه ارزیابی سلامت برند (صفحه ۳۴)' : '4-Dimensional Brand Excellence Matrix'}
              </h3>

              <div className="space-y-3.5 text-xs font-semibold">
                
                {/* 1. Financial Performance - 30 pt */}
                <div className="space-y-1">
                  <div className="flex justify-between text-white/80">
                    <span>{lang === 'fa' ? '۱. عملکرد مالی و فروش (۳۰ امتیاز)' : '1. Financial & Sales (30pt)'}</span>
                    <span className="font-mono text-emerald-300">28 / 30</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[93%]"></div>
                  </div>
                </div>

                {/* 2. Customer Experience - 30 pt */}
                <div className="space-y-1">
                  <div className="flex justify-between text-white/80">
                    <span>{lang === 'fa' ? '۲. تجربه مشتری و رضایت (۳۰ امتیاز)' : '2. Customer Experience (30pt)'}</span>
                    <span className="font-mono text-[#e5b85a]">26 / 30</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#e5b85a] h-full w-[86%]"></div>
                  </div>
                </div>

                {/* 3. Operations & Quality - 25 pt */}
                <div className="space-y-1">
                  <div className="flex justify-between text-white/80">
                    <span>{lang === 'fa' ? '۳. کیفیت و دقت عملیاتی (۲۵ امتیاز)' : '3. Quality & Operations (25pt)'}</span>
                    <span className="font-mono text-[#e5b85a]">21 / 25</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#e5b85a] h-full w-[84%]"></div>
                  </div>
                </div>

                {/* 4. Growth & Professionalism - 15 pt */}
                <div className="space-y-1">
                  <div className="flex justify-between text-white/80">
                    <span>{lang === 'fa' ? '۴. خلاقیت و رشد مهارت‌ها (۱۵ امتیاز)' : '4. Growth & Skills (15pt)'}</span>
                    <span className="font-mono text-purple-300">12 / 15</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full w-[80%]"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Middle: KARA Brain Real-time AI recommendations */}
            <div className="glass-card rounded-2xl p-5 space-y-4 lg:col-span-2 bg-gradient-to-br from-[#9d1c52]/10 to-transparent">
              <div className="flex items-center justify-between border-b border-[#e5b85a]/15 pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#e5b85a] animate-pulse" />
                  <span>{lang === 'fa' ? 'هوش تجاری کارا (KARA Brain AI Advice)' : 'KARA Brain AI Business Advisor'}</span>
                </h3>
                <span className="bg-[#e5b85a]/10 border border-[#e5b85a]/25 text-[#e5b85a] px-2 py-0.5 rounded text-[8px] font-mono">
                  LIVE ADVICE
                </span>
              </div>

              <div className="space-y-3">
                {getKaraBrainTips(founderBrand).map((tip, idx) => (
                  <div key={idx} className="p-3 bg-[#1b0313]/60 border border-[#e5b85a]/15 rounded-xl flex gap-3 text-right">
                    <div className="w-6 h-6 rounded-full bg-[#e5b85a]/15 text-[#e5b85a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-semibold text-rose-100 leading-relaxed font-sans">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[9px] text-white/30 block font-mono">
                  * RECOMMENDATIONS GENERATED OVERNIGHT ACCORDING TO SALES LEDGER DATA (PAGE 44 Constitution)
                </span>
              </div>
            </div>
          </div>

          {/* ACTIVE SKU CATALOG & PRODUCT STOCK MANAGER (PAGE 41-42) */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#e5b85a]" />
                <span>{lang === 'fa' ? 'مدیریت موجودی کالاها و شناسه محصول (SKU / Product Engines)' : 'SKU & Inventory Product Engines'}</span>
              </h3>
              <span className="text-[10px] text-white/40">
                {lang === 'fa' ? 'برند فعال:' : 'Active brand:'} <span className="font-bold text-[#e5b85a]">{founderBrand.name}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(products[founderBrand.id] || []).map((product) => (
                <div 
                  key={product.id} 
                  className={`p-4 border rounded-2xl space-y-3 transition flex flex-col justify-between ${
                    product.stock === 0 
                      ? 'bg-rose-500/5 border-rose-500/25 opacity-70' 
                      : product.stock <= 5 
                        ? 'bg-amber-500/5 border-amber-500/25 shadow-sm' 
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate" title={product.name}>
                        {lang === 'fa' ? product.name : product.enName}
                      </h4>
                      <span className="text-[9px] text-[#e5b85a] font-mono block mt-0.5">SKU: {product.id.toUpperCase()}</span>
                      <span className="text-[9px] text-white/40 block mt-0.5">Category: {product.category}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[11px] font-mono font-semibold">
                    <div className="text-right">
                      <span className="text-white/40 text-[9px] block">قیمت فروش:</span>
                      <span className="text-emerald-300">{product.priceSell.toLocaleString()} IRR</span>
                    </div>
                    <div className="text-left">
                      <span className="text-white/40 text-[9px] block">حاشیه سود:</span>
                      <span className="text-[#e5b85a]">
                        {(((product.priceSell - product.priceBuy) / product.priceSell) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Stock alerting rules (page 42) */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/50">{lang === 'fa' ? 'موجودی انبار:' : 'Stock count:'}</span>
                      <span className={`text-xs font-mono font-bold ${
                        product.stock === 0 ? 'text-rose-400' :
                        product.stock <= 5 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                      }`}>
                        {product.stock} {lang === 'fa' ? 'عدد' : 'units'}
                      </span>
                    </div>

                    <div>
                      {product.stock === 0 ? (
                        <span className="bg-rose-500/10 border border-rose-500/25 text-rose-300 px-2 py-0.5 rounded-full text-[8px] uppercase font-bold">
                          {lang === 'fa' ? 'عدم نمایش در فروشگاه' : 'HIDDEN FROM CLIENTS'}
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="bg-amber-500/15 border border-amber-500/25 text-amber-300 px-2 py-0.5 rounded-full text-[8px] uppercase font-bold">
                          {lang === 'fa' ? 'کالای روبه اتمام' : 'LOW STOCK WARNING'}
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[8px] uppercase font-bold">
                          {lang === 'fa' ? 'فعال و موجود' : 'ONLINE'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BRAND SPECIFIC TRANSACTIONS & LEADERBOARD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Left: Brand's own transactions list (Isolated) */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#e5b85a]">
                  <ShoppingBag className="w-4 h-4 text-[#e5b85a]" />
                  <span>{lang === 'fa' ? `تراکنش‌های انحصاری مالی برند: ${founderBrand.name}` : `Isolated Financial Transactions Ledger: ${founderBrand.enName}`}</span>
                </h3>
                <p className="text-[10px] text-white/50 mt-1">
                  {lang === 'fa' 
                    ? 'به منظور رعایت حریم خصوصی موضوع ماده ۵، شما صرفاً به لجر اختصاصی فروش محصولات خود دسترسی دارید.' 
                    : 'According to Privacy rules, you can only view orders corresponding to your registered SKUs.'}
                </p>
              </div>

              {brandSpecificOrders.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-xs">
                  {lang === 'fa' ? 'هیچ تراکنشی برای این برند یافت نشد.' : 'No transactions recorded for this brand yet.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 font-medium">
                        <th className="pb-2 text-right">{lang === 'fa' ? 'شناسه تراکنش' : 'Transaction ID'}</th>
                        <th className="pb-2">{lang === 'fa' ? 'محصول' : 'Product'}</th>
                        <th className="pb-2 text-center">{lang === 'fa' ? 'تاریخ ثبت' : 'Date'}</th>
                        <th className="pb-2 text-center">{lang === 'fa' ? 'مبلغ ناخالص' : 'Gross Amount'}</th>
                        <th className="pb-2 text-center">{lang === 'fa' ? 'وضعیت تحویل' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {brandSpecificOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/[0.01] transition">
                          <td className="py-2.5 font-mono text-[#e5b85a]">{o.id}</td>
                          <td className="py-2.5 text-white/90">{o.item}</td>
                          <td className="py-2.5 text-center text-white/60 font-mono">{o.date}</td>
                          <td className="py-2.5 text-center font-mono text-emerald-400">
                            {o.amount.toLocaleString()} {lang === 'fa' ? 'ریال' : 'IRR'}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] ${
                              o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-300' :
                              o.status === 'shipped' ? 'bg-indigo-500/10 text-indigo-300' :
                              o.status === 'preparing' ? 'bg-amber-500/10 text-amber-300' :
                              'bg-amber-500/10 text-amber-300'
                            }`}>
                              {o.status === 'delivered' ? (lang === 'fa' ? 'تحویل شده' : 'Delivered') :
                               o.status === 'shipped' ? (lang === 'fa' ? 'ارسال شده' : 'Shipped') :
                               (lang === 'fa' ? 'درحال آماده‌سازی' : 'Preparing')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right: Brand performance & competitive board */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#e5b85a]">
                  <Award className="w-4 h-4 text-[#e5b85a]" />
                  <span>{lang === 'fa' ? 'جدول رقابت کاری و رتبه‌بندی کیفی برندها' : 'Ecosystem Brand Competition & Quality Board'}</span>
                </h3>
                <p className="text-[10px] text-white/50 mt-1">
                  {lang === 'fa' 
                    ? 'نتیجه تلاش، امتیاز بهداشت برند و میزان فروش بر مبنای معیارهای چهارگانه عملکرد.' 
                    : 'Live competition standings based on the 4-Dimensional brand score, sales volume, and risk index.'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 font-medium">
                      <th className="pb-2 text-right">{lang === 'fa' ? 'رتبه' : 'Rank'}</th>
                      <th className="pb-2 text-right">{lang === 'fa' ? 'برند همکار' : 'Brand Name'}</th>
                      <th className="pb-2 text-center">{lang === 'fa' ? 'رده کیفی' : 'Quality Tier'}</th>
                      <th className="pb-2 text-center">{lang === 'fa' ? 'امتیاز سلامت' : 'Health Score'}</th>
                      <th className="pb-2 text-center">{lang === 'fa' ? 'مجموع فروش' : 'Sales Vol'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {brandLeaderboard.slice(0, 8).map((b, idx) => {
                      const isCurrent = b.id === founderBrand.id;
                      return (
                        <tr 
                          key={b.id} 
                          className={`transition ${isCurrent ? 'bg-[#9d1c52]/10 border border-[#e5b85a]/25 text-white' : 'hover:bg-white/[0.01]'}`}
                        >
                          <td className="py-2.5 text-right font-mono font-bold">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                          </td>
                          <td className="py-2.5 text-right">
                            <span className={`block ${isCurrent ? 'text-[#e5b85a] font-bold' : 'text-white/80'}`}>
                              {lang === 'fa' ? b.name : b.enName} {isCurrent && (lang === 'fa' ? ' (شما)' : ' (You)')}
                            </span>
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                              b.tier === 'Golden' || b.tier === 'Diamond' ? 'bg-amber-500/10 text-amber-300' :
                              b.tier === 'Mumtaz' ? 'bg-purple-500/10 text-purple-300' :
                              'bg-emerald-500/10 text-emerald-300'
                            }`}>
                              {lang === 'fa' ? b.tier : b.enTier}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono">
                            <span className={b.score >= 90 ? 'text-emerald-400' : b.score >= 75 ? 'text-[#e5b85a]' : 'text-rose-400'}>
                              {b.score} pt
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono text-white/60">{b.salesCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* 🛍️ PERSPECTIVE 4: CLIENT INTERACTIVE STORE PORTAL & LEDGER INTEGRATOR */}
      {/* ========================================================================= */}
      {activeRole === 'customer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-gradient-to-r from-[#9d1c52]/10 to-transparent border border-[#e5b85a]/25 rounded-3xl p-5 text-right relative overflow-hidden">
            <div className="absolute left-6 -bottom-6 w-32 h-32 bg-[#e5b85a]/10 rounded-full blur-2xl"></div>
            <h3 className="text-base font-black text-[#e5b85a] flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 animate-pulse text-[#e5b85a]" />
              <span>{lang === 'fa' ? 'باشگاه مشتریان و پورتال خرید کارا (Consumer Portal)' : 'KARA Customer Loyalty Club'}</span>
            </h3>
            <p className="text-xs text-rose-100/60 leading-relaxed mt-1.5 max-w-2xl font-sans">
              {lang === 'fa'
                ? 'با خرید محصولات ممتاز تولید بانوان کارآفرین، اطلاعات تراکنش شما مستقیماً در لجر اصلی همگام با گوگل شیتس ثبت شده و سفارش از طریق شبکه سراسری ارسال می‌شود.'
                : 'Purchase premium handcrafts and organic products directly. Shopping here triggers actual entry rows inside your Google Sheets ledger, and increases your loyalty score.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Beautiful Product browser */}
            <div className="glass-card rounded-2xl p-5 lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#e5b85a]" />
                  <span>{lang === 'fa' ? 'کاتالوگ محصولات لوکس سبک زندگی (۴۰ کالا)' : 'Lifestyle Products Catalog'}</span>
                </h3>

                {/* Filter shop by brand */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-white/40">{lang === 'fa' ? 'فروشگاه:' : 'Store:'}</span>
                  <select
                    value={selectedBrandForShopping}
                    onChange={(e) => setSelectedBrandForShopping(e.target.value)}
                    className="bg-[#1b0313] border border-white/10 text-white font-bold py-1 px-3 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="luna">{lang === 'fa' ? 'مراقبت پوست لونا' : 'Luna Cosmetics'}</option>
                    <option value="delara">{lang === 'fa' ? 'عطر لوکس دلآرا' : 'Delara Perfumes'}</option>
                    <option value="karwan">{lang === 'fa' ? 'اکسسوری چرمی کاروان' : 'Karwan Leather'}</option>
                    <option value="zarbaft">{lang === 'fa' ? 'صنایع دستی زربفت' : 'Zarbaft Handicrafts'}</option>
                  </select>
                </div>
              </div>

              {/* Grid of Shopping Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(products[selectedBrandForShopping] || []).map((product) => {
                  const outOfStock = product.stock === 0;
                  return (
                    <div 
                      key={product.id} 
                      className={`p-3 border.5 rounded-2xl flex flex-col justify-between gap-3 transition ${
                        outOfStock 
                          ? 'bg-rose-950/10 border-rose-900/10 opacity-50' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate">
                            {lang === 'fa' ? product.name : product.enName}
                          </h4>
                          <span className="text-[10px] text-rose-300 font-mono block mt-0.5">
                            {selectedBrandForShopping === 'luna' ? 'Luna Beauty' :
                             selectedBrandForShopping === 'delara' ? 'Delara Perfumes' :
                             selectedBrandForShopping === 'zarbaft' ? 'Zarbaft Afghan' : 'Karwan Accessories'}
                          </span>
                          <span className="text-xs font-bold text-emerald-300 font-mono block mt-1">
                            {product.priceSell.toLocaleString()} IRR
                          </span>
                        </div>
                      </div>

                      <div>
                        {outOfStock ? (
                          <button
                            disabled
                            className="w-full py-2 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-xl text-[10px] font-bold uppercase"
                          >
                            {lang === 'fa' ? 'ناموجود' : 'Sold Out'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchaseProduct(product, selectedBrandForShopping)}
                            className="w-full py-2 bg-[#9d1c52] hover:bg-[#9d1c52]/80 border border-[#e5b85a]/30 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#e5b85a]" />
                            <span>{lang === 'fa' ? 'پرداخت و خرید کالا' : 'Purchase SKU'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Customer support and loyalty tickets */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              
              {/* Customer Account & Points */}
              <div className="p-4 bg-[#9d1c52]/5 border border-[#e5b85a]/15 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Coins className="w-5 h-5 text-[#e5b85a]" />
                  <span className="text-white/60">{lang === 'fa' ? 'امتیاز وفاداری باشگاه کارا:' : 'KARA Loyalty Balance:'}</span>
                </div>
                <div className="flex items-end justify-between font-mono">
                  <span className="text-2xl font-black text-[#e5b85a]">{orders.length * 150} pts</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {lang === 'fa' ? 'سطح برنزی ممتار' : 'Bronze Level'}
                  </span>
                </div>
              </div>

              {/* TOP CUSTOMER REWARDS & COMPETITION BOARD */}
              <div className="p-4 bg-gradient-to-br from-[#e5b85a]/10 to-transparent border border-[#e5b85a]/25 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 border-b border-[#e5b85a]/15 pb-2">
                  <Award className="w-5 h-5 text-[#e5b85a]" />
                  <span className="text-white font-bold text-xs">{lang === 'fa' ? 'جدول رقابت مشتریان برتر و هدایا' : 'Top Customers Reward Standing'}</span>
                </div>
                <div className="space-y-2">
                  {customerLeaderboard.map((cust, idx) => {
                    const isMe = cust.isMe;
                    return (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 transition ${
                          isMe 
                            ? 'bg-[#9d1c52]/10 border-[#e5b85a]/30 text-white' 
                            : 'bg-white/[0.01] border-white/5 text-white/80'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="font-mono text-[10px] text-[#e5b85a]">
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                            </span>
                            <span className={isMe ? 'text-[#e5b85a]' : 'text-white/90'}>
                              {cust.name}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-bold text-emerald-400">
                            {cust.points} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-white/50 border-t border-white/5 pt-1.5">
                          <span className="text-[#e5b85a]">🎁 {lang === 'fa' ? 'جایزه هدف:' : 'Target prize:'}</span>
                          <span className="text-rose-100/70 truncate">{cust.prize}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] text-white/45 text-center pt-1 font-mono">
                  {lang === 'fa' ? 'با هر خرید ۱۵۰ امتیاز به سهم خود افزوده و رتبه خود را ارتقا دهید.' : 'Every checkout adds +150 points to boost your standing.'}
                </p>
              </div>

              {/* File complaint Form */}
              <form onSubmit={handleCreateTicket} className="space-y-3 pt-2">
                <span className="text-[11px] uppercase tracking-wider text-[#e5b85a] font-bold block">
                  💬 {lang === 'fa' ? 'ثبت شکایات یا بازخورد اصالت کالا' : 'Submit Support & Quality Ticket'}
                </span>
                <input
                  type="text"
                  placeholder={lang === 'fa' ? 'عنوان شکایت یا بازخورد...' : 'Subject of complaint / ticket...'}
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e5b85a]/40"
                />
                <button
                  type="submit"
                  disabled={!newTicketSubject.trim()}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
                >
                  <Send className="w-3 h-3 text-[#e5b85a]" />
                  <span>{lang === 'fa' ? 'ارسال درخواست به کارشناسان کارا' : 'Submit Ticket'}</span>
                </button>
              </form>

              {/* Customer Active support tickets history */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] text-white/40 uppercase block tracking-wider font-mono">ACTIVE TICKETS ({customerTickets.length})</span>
                {customerTickets.map(tkt => (
                  <div key={tkt.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1.5 text-xs text-white/80">
                    <div className="flex justify-between items-start">
                      <span className="font-bold max-w-[150px] truncate">{tkt.subject}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        tkt.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                      }`}>
                        {tkt.status === 'resolved' ? 'پاسخ داده شده' : 'در انتظار'}
                      </span>
                    </div>
                    {tkt.reply && (
                      <p className="text-[10px] text-rose-200/50 bg-[#2a0314]/30 p-2 rounded-lg border border-[#e5b85a]/10 mt-1">
                        {tkt.reply}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
