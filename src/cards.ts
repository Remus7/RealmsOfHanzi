export type Rarity = 'Common' | 'Rare' | 'EX';
export type HskLevel = 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
export type Element = 'Water' | 'Fire' | 'Earth' | 'Metal' | 'Wood';

export type Card = {
  id: string;
  hanzi: string;
  pinyin: string;
  rarity: Rarity;
  hsk: HskLevel;
  element: Element;
  image: string;
};

const images = import.meta.glob('../Cards/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const imageFor = (file: string) => images[`../Cards/${file}`];

export const backImage = imageFor('BackImage.png');

export const cards: Card[] = [
  ['Ce4Hua4.png', '策划', 'ce hua', 'Rare', 'HSK 5', 'Metal'],
  ['Zhao1Ren2.png', '招人', 'zhao ren', 'Common', 'HSK 4', 'Wood'],
  ['Gong1Zi1.png', '工资', 'gong zi', 'Common', 'HSK 3', 'Earth'],
  ['Ru4Xiang1Sui2Su2.png', '入乡随俗', 'ru xiang sui su', 'Rare', 'HSK 6', 'Earth'],
  ['Kua4Guo2Gong1Si1-Ex.png', '跨国公司', 'kua guo gong si', 'EX', 'HSK 5', 'Water'],
  ['Tong2Gong1Tong2Chou2-Ex.png', '同工同酬', 'tong gong tong chou', 'EX', 'HSK 6', 'Metal'],
  ['Bao4Chou5-Ex.png', '报酬', 'bao chou', 'EX', 'HSK 5', 'Earth'],
  ['Cheng2Shu2.png', '成熟', 'cheng shu', 'Rare', 'HSK 5', 'Earth'],
  ['You2Yu4-Ex.png', '犹豫', 'you yu', 'EX', 'HSK 5', 'Water'],
  ['Zi4You2Zhi2Ye4.png', '自由职业', 'zi you zhi ye', 'Rare', 'HSK 5', 'Water'],
  ['Dai4Yu4.png', '待遇', 'dai yu', 'Rare', 'HSK 5', 'Metal'],
  ['Ji4Xu4.png', '继续', 'ji xu', 'Common', 'HSK 3', 'Wood'],
  ['Po1Leng3Shui3-Ex.png', '泼冷水', 'po leng shui', 'EX', 'HSK 6', 'Water'],
  ['Jiu4Ye4.png', '就业', 'jiu ye', 'Rare', 'HSK 5', 'Earth'],
  ['Ying4Pin4.png', '应聘', 'ying pin', 'Rare', 'HSK 5', 'Metal'],
  ['Zhun3Que4.png', '准确', 'zhun que', 'Common', 'HSK 4', 'Metal'],
  ['Le4Yi4.png', '乐意', 'le yi', 'Common', 'HSK 4', 'Wood'],
  ['Tiao4Cao2-Ex.png', '跳槽', 'tiao cao', 'EX', 'HSK 6', 'Fire'],
  ['Gao1Xin1-Ex.png', '高薪', 'gao xin', 'EX', 'HSK 5', 'Earth'],
  ['Shi2Li4.png', '实力', 'shi li', 'Rare', 'HSK 5', 'Fire'],
  ['Wan4Ba3Kuai4.png', '万把块', 'wan ba kuai', 'Rare', 'HSK 6', 'Earth'],
  ['Xin1Chou2.png', '薪酬', 'xin chou', 'Rare', 'HSK 6', 'Metal'],
  ['Gao1Duan1.png', '高端', 'gao duan', 'Rare', 'HSK 5', 'Metal'],
  ['Fu2Li4.png', '福利', 'fu li', 'Common', 'HSK 4', 'Wood'],
  ['You1Shi4.png', '优势', 'you shi', 'Common', 'HSK 4', 'Fire'],
  ['Pin4Yong4.png', '聘用', 'pin yong', 'Rare', 'HSK 5', 'Wood'],
  ['Lei4Si4.png', '类似', 'lei si', 'Common', 'HSK 4', 'Water'],
  ['Li2Zhi2.png', '离职', 'li zhi', 'Rare', 'HSK 5', 'Metal'],
  ['Liu2Yi4.png', '留意', 'liu yi', 'Common', 'HSK 4', 'Metal'],
  ['Shuang1Yu3.png', '双语', 'shuang yu', 'Common', 'HSK 4', 'Water'],
  ['Qi1Wang4.png', '期望', 'qi wang', 'Common', 'HSK 4', 'Wood'],
  ['Yu4Qi1.png', '预期', 'yu qi', 'Rare', 'HSK 5', 'Wood'],
].map(([file, hanzi, pinyin, rarity, hsk, element]) => ({
  id: file.replace('.png', ''),
  hanzi,
  pinyin,
  rarity,
  hsk,
  element,
  image: imageFor(file),
})) as Card[];

export const rarities = [...new Set(cards.map((card) => card.rarity))];
export const hskLevels = [...new Set(cards.map((card) => card.hsk))];
export const elements: Element[] = ['Water', 'Fire', 'Earth', 'Metal', 'Wood'];
