function Modifier(flags, modFunc) {
  if(this instanceof Modifier == false)
    return new Modifier(flags, modFunc);

  try{
    this.flag = flags.map(function(f){return f[1];});
    this.desc = flags.map(function(f){return f[0];});
    this.modFunc = modFunc;
  } catch(e){
    console.error(flags, modFunc);
  };
}

function Term(word, kanji, ruby, def) {
    if(this instanceof Term == false)
      return new Term(word, kanji, def);
    this.word = word;
    this.kanji = '';
    this.ruby = word;

    if ($("#opt-kanji:checked").length == 0)
      this.kanji = kanji;
    if (this.kanji)
      this.ruby = ruby;
    this.def = def;
};

Term.prototype.render = function() {
  if ($("#opt-kanji:checked").length == 0)
    return this.word;

  if ($("#opt-furigana:checked").length == 1)
    return this.ruby || this.word;

  return this.kanji || this.word;
}

var KANA_FAM = {
  V: ['わ','え','い','お','う'],

  K: ['か','け','き','こ','く'],
  G: ['が','げ','ぎ','ご','ぐ'],

  H: ['は','へ','ひ','ほ','ふ'],
  B: ['ば','べ','び','ぼ','ぶ'],
  P: ['ぱ','ぺ','ぴ','ぽ','ぷ'],

  S: ['さ','せ','し','そ','す'],
  Z: ['ざ','ぜ','じ','ぞ','ず'],

  T: ['た','て','ち','と','つ'],
  D: ['だ','で','ぢ','ど', null],

  N: ['な','ね','に','の','ぬ'],
  M: ['ま','め','み','も','む'],
  R: ['ら','れ','り','ろ','る'],
  Y: ['や', null, null, 'よ', 'ゆ'],

};

var Mogrify = {
  _mog: function(kana, index)
  {
    for(base in KANA_FAM)
    {
      if(KANA_FAM[base].indexOf(kana) != -1)
      {
        return KANA_FAM[base][index]
      }
    }
    console.error("No mogrification for kana: " + kana);
  },
  A: function(kana)
  {
      return Mogrify._mog(kana, 0);
  },
  E: function(kana)
  {
      return Mogrify._mog(kana, 1);
  },
  I: function(kana)
  {
      return Mogrify._mog(kana, 2);
  },
  O: function(kana)
  {
      return Mogrify._mog(kana, 3);
  },
  U: function(kana)
  {
      return Mogrify._mog(kana, 4);
  },
};

var ModTypes = {
  BASE: ['', 'base'],
  FORMAL: ['Formal', 'formal'],
  INFORMAL: ['Informal', 'informal'],
  PAST: ['Past', 'past'],
  NEGATIVE: ['Negative' ,'negative'],
  TE: ['て-form', 'verbte'],
  WANTING: ["Wanting", "wanting"],
  VOLITIONAL: ['Volitional', 'volitional'],
  POTENTIAL: ['Potential', 'potential'],
  CAUSATIVE: ['Causative', 'causative'],
  PASSIVE: ['Passive', 'passive'],
  PROGRESSIVE: ['Progressive', 'progressive'],
  IMPERATIVE: ['Imperative', 'imperative'],
  PROBABLE: ['Probable', 'probable'],
  CONDITIONAL_REBA: ['Conditional (-えば)', 'conditional_reba'],
  CONDITIONAL_TARA: ['Conditional (-たら)', 'conditional_tara'],
  REQUEST: ['Request', 'request'],
  SEEMSLIKE: ['Seems like', 'seemslike'],
};

var ICHIDAN = [
    // informal indicative
    Modifier([ModTypes.INFORMAL], function(w) {
        return w;
    }),
    // informal progressive
    Modifier([ModTypes.INFORMAL, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ている';
    }),
    // informal volitional
    Modifier([ModTypes.INFORMAL, ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'よう';
    }),
    // informal imperative
    Modifier([ModTypes.INFORMAL, ModTypes.IMPERATIVE], function(w) {
        return trimLast(w) + 'ろ';
    }),
    // informal potential
    Modifier([ModTypes.INFORMAL, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られる';
    }),
    // informal conditional (reba)
    Modifier([ModTypes.INFORMAL, ModTypes.CONDITIONAL_REBA], function(w) {
        return trimLast(w) + 'れば';
    }),
    // informal conditional (tara)
    Modifier([ModTypes.INFORMAL, ModTypes.CONDITIONAL_TARA], function(w) {
        return trimLast(w) + 'たら';
    }),
    // informal passive
    Modifier([ModTypes.INFORMAL, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られる';
    }),
    // informal causative
    Modifier([ModTypes.INFORMAL, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させる';
    }),
    // informal negative indicative
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE], function(w) {
        return trimLast(w) + 'ない';
    }),
    // informal negative progressive
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていない';
    }),
    // informal negative imperative
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.IMPERATIVE], function(w) {
        return trimLast(w) + 'るな';
    }),
    // informal negative volitional
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'まい';
    }),
    // informal negative potential
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られない';
    }),
    // informal negative conditional (reba)
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.CONDITIONAL_REBA], function(w) {
        return trimLast(w) + 'なければ';
    }),
    // informal negative conditional (tara)
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.CONDITIONAL_TARA], function(w) {
        return trimLast(w) + 'なかったら';
    }),
    // informal negative passive
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られない';
    }),
    // informal negative causative
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させない';
    }),
    // informal past indicative
    Modifier([ModTypes.INFORMAL], function(w) {
        return trimLast(w) + 'た';
    }),
    // informal past progressive
    Modifier([ModTypes.INFORMAL, ModTypes.PAST, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていた';
    }),
    // informal past potential
    Modifier([ModTypes.INFORMAL, ModTypes.PAST, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られた';
    }),
    // informal past passive
    Modifier([ModTypes.INFORMAL, ModTypes.PAST, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られた';
    }),
    // informal past causative
    Modifier([ModTypes.INFORMAL, ModTypes.PAST, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させた';
    }),
    // informal negative past indicative
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
        return trimLast(w) + 'なかった';
    }),
    // informal negative past progressive
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていなかった';
    }),
    // informal negative past potential
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られなかった';
    }),
    // informal negative past passive
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られなかった';
    }),
    // informal negative past causative
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させなかった';
    }),
    // polite indicative
    Modifier([ModTypes.FORMAL], function(w) {
        return trimLast(w) + 'ます';
    }),
    // polite progressive
    Modifier([ModTypes.FORMAL, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ています';
    }),
    // polite volitional
    Modifier([ModTypes.FORMAL, ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'ましょう';
    }),
    // polite imperative
    Modifier([ModTypes.FORMAL, ModTypes.IMPERATIVE], function(w) {
        return trimLast(w) + 'てください';
    }),
    // polite potential
    Modifier([ModTypes.FORMAL, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られます';
    }),
    // polite passive
    Modifier([ModTypes.FORMAL, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られます';
    }),
    // polite causative
    Modifier([ModTypes.FORMAL, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させます';
    }),
    // polite past indicative
    Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w) {
        return trimLast(w) + 'ました';
    }),
    // polite past progressive
    Modifier([ModTypes.FORMAL, ModTypes.PAST, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていました';
    }),
    // polite past potential
    Modifier([ModTypes.FORMAL, ModTypes.PAST, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られました';
    }),
    // polite past passive
    Modifier([ModTypes.FORMAL, ModTypes.PAST, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られました';
    }),
    // polite past causative
    Modifier([ModTypes.FORMAL, ModTypes.PAST, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させました';
    }),
    // polite negative indicative
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w) {
        return trimLast(w) + 'ません';
    }),
    // polite negative progressive
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていません';
    }),
    // polite negative potential
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られません';
    }),
    // polite negative imperative
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.IMPERATIVE], function(w) {
        return trimLast(w) + 'ないでください';
    }),
    // polite negative volitional
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'ますまい';
    }),
    // polite negative passive
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られません';
    }),
    // polite negative causative
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させません';
    }),
    // polite negative past indicative
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
        return trimLast(w) + 'ませんでした';
    }),
    // polite negative past progressive
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ていませんでした';
    }),
    // polite negative past potential
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られませんでした';
    }),
    // polite negative past passive
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られませんでした';
    }),
    // polite negative past causative
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させませんでした';
    })
];

var GODAN = [
  Modifier([ModTypes.TE], function(w) {
      var e, l = snipLast(w);
      switch(l)
      {
        case 'す':
          e = 'して';
          break;
        case 'く':
          e = 'いて';
          break;
        case 'ぐ':
          e = 'いで';
          break;
        case 'ぬ':
        case 'ぶ':
        case 'む':
          e = 'んで';
          break;
        case 'る':
        case 'つ':
        case 'う':
          e = 'って';
          break;
        default:
          console.error('No te conj for: ' + l)
      }
      return trimLast(w) + e;
  }),

  Modifier([ModTypes.INFORMAL, ModTypes.PAST], function(w) {
      var e, l = snipLast(w);
      switch(l)
      {
        case 'す':
          e = 'した';
          break;
        case 'く':
          e = 'いた';
          break;
        case 'ぐ':
          e = 'いだ';
          break;
        case 'ぬ':
        case 'ぶ':
        case 'む':
          e = 'んだ';
          break;
        case 'る':
        case 'つ':
        case 'う':
          e = 'った';
          break;
        default:
          console.error('No past conj for: ' + l)
      }
      return trimLast(w) + e;
  }),
  Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE], function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.A(l) + 'ない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.I(l) + 'ません';
  }),
  Modifier([ModTypes.CAUSATIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せる';
  }),
  Modifier([ModTypes.PASSIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'れる';
  }),
  Modifier([ModTypes.POTENTIAL], function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'る';
  }),
  Modifier([ModTypes.CONDITIONAL_REBA], function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'ば';
  }),
  Modifier([ModTypes.VOLITIONAL], function(w) {
      return trimLast(w) + Mogrify.O(snipLast(w)) + 'う';
  }),
  Modifier([ModTypes.FORMAL], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ます';
  }),
  Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'なかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ませんでした';
  }),
  Modifier([ModTypes.CAUSATIVE, ModTypes.PASSIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せられる';
  }),
  Modifier([ModTypes.IMPERATIVE], function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w));
  }),
  Modifier([ModTypes.SEEMSLIKE], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'そう';
  }),
  Modifier([ModTypes.SEEMSLIKE, ModTypes.NEGATIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'なさそう';
  }),
  //
  Modifier([ModTypes.WANTING], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'たい';
  }),
  Modifier([ModTypes.PAST, ModTypes.WANTING], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'たかった';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.WANTING], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'たくない';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST, ModTypes.WANTING], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) +  'たくなかった';
  }),
]

var irreg_do = [
    {
      base: "する",
      kanji: "為る",
      polite: "します",
      te: "して",

      past: "した",
      polpast: "しました",

      neg: "しない",
      polneg: "しません",

      pastneg: "しなかった",
      polpastneg: "しませんでした",

      volitional: "しよう",
      passive: "される",
      causative: "させる",
      potential: "できる",
      imperative: "しろ",
      conditional: "すれば",
    },
    {
      base: "くる",
      kanji: "来る",
      polite: "きます",
      te: "きて",

      past: "きた",
      polpast: "きました",

      neg: "こない",
      polneg: "きません",

      pastneg: "こなかった",
      polpastneg: "きませんでした",

      volitional: "こよう",
      passive: "こられる",
      causative: "こさせる",
      potential: "これる",
      imperative: "こい",
      conditional: "くれば",
    },
]

var irreg_exist = [
    {
      base: "だ",
      polite: "です",

      past: "だった",
      polpast: "でした",

      neg: "ではない",
      polneg: "ではありません",

      pastneg: "ではなかった",
      polpastneg: "ではありませんでした",

      probable: "だろう",
      polprobable: "でしょう",

      negprob: "ではないだろう",
      polnegprob: "ではないでしょう",
    },
    {
      base: "ある",
      polite: "あります",

      past: "あった",
      polpast: "ありました",

      neg: "ない",
      polneg: "ありません",

      pastneg: "なかった",
      polpastneg: "ありませんでした",

      probable: "あるだろう",
      polprobable: "あるでしょう",

      negprob: "ないだろう",
      polnegprob: "ないでしょう",
    },
    {
      base: "いる",
      polite: "います",

      past: "いった",
      polpast: "いました",

      neg: "いない",
      polneg: "いません",

      pastneg: "いなかった",
      polpastneg: "いませんでした",

      probable: "いるだろう",
      polprobable: "いるでしょう",

      negprob: "いないだろう",
      polnegprob: "いないでしょう",
    }
];

function irreg_get(terms, w) {
  var i, t;
  for(i=0;i<terms.length;i++)
  {
    t = terms[i];
    if(t.base.localeCompare(w) == 0)
      return t;
    if('kanji' in t && t.kanji.localeCompare(w) == 0)
      return t;
  }
  console.error('No irregular term for: ' + w);
}

var IRREGULAR_DO = [
  Modifier([ModTypes.FORMAL], function(w){
    return irreg_get(irreg_do, w).polite;
  }),
  Modifier([ModTypes.TE], function(w){
    return irreg_get(irreg_do, w).te;
  }),
  Modifier(ModTypes.PAST, function(w){
    return irreg_get(irreg_do, w).past;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return irreg_get(irreg_do, w).polpast;
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return irreg_get(irreg_do, w).neg;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return irreg_get(irreg_do, w).polneg;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return irreg_get(irreg_do, w).pastneg;
  }),
  Modifier([ModTypes.VOLITIONAL], function(w){
    return irreg_get(irreg_do, w).volitional;
  }),
  Modifier([ModTypes.PASSIVE], function(w){
    return irreg_get(irreg_do, w).passive;
  }),
  Modifier([ModTypes.CAUSATIVE], function(w){
    return irreg_get(irreg_do, w).causative;
  }),
  Modifier([ModTypes.POTENTIAL], function(w){
    return irreg_get(irreg_do, w).potential;
  }),
  Modifier([ModTypes.IMPERATIVE], function(w){
    return irreg_get(irreg_do, w).imperative;
  }),
  Modifier([ModTypes.CONDITIONAL_REBA], function(w){
    return irreg_get(irreg_do, w).conditional;
  }),
]

var IRREGULAR_EXIST = [
  Modifier([ModTypes.FORMAL], function(w){
    return irreg_get(irreg_exist, w).polite;
  }),
  Modifier([ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).probable;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).polprobable;
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).negprob;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).polnegprob;
  }),
]

var II_ADJECTIVE = [
  Modifier([ModTypes.FORMAL], function(w){
    return w + 'です';
  }),
  Modifier([ModTypes.PAST], function(w){
    return trimLast(w) + 'かった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return trimLast(w) + 'かったです';
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return trimLast(w) + 'くない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return trimLast(w) + 'くありません';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return trimLast(w) + 'くなかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return trimLast(w) + 'くありませんでした';
  }),
  Modifier(ModTypes.TE, function(w){
    return trimLast(w) + 'くて';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.TE], function(w){
    return trimLast(w) + 'てない';
  }),
  Modifier([ModTypes.SEEMSLIKE], function(w){
    return trimLast(w) + 'そう';
  }),
]

var NA_ADJECTIVE = [
  Modifier([ModTypes.TE], function(w){
    return w + 'で';
  }),
  Modifier([ModTypes.FORMAL], function(w){
    return w + 'です';
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return w + 'ではない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return w + 'ではありません';
  }),
  Modifier([ModTypes.PAST], function(w){
    return w + 'だった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return w + 'でした';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return w + 'ではなかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return w + 'ではありませんでした';
  }),
  Modifier([ModTypes.TE], function(w){
    return w + 'で';
  }),
  Modifier([ModTypes.SEEMSLIKE], function(w){
    return w + 'そう';
  }),
]
