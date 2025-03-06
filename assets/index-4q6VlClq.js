var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _lottos, _statistics, _WinningStatistics_instances, calculateBonusNumber_fn, addMatchedCount_fn, _purchaseAmount, _lottos2, _LottoPurchase_instances, handleSubmit_fn, handleValidation_fn, _WinningLotto_instances, setFormEventListeners_fn, setInputEventListeners_fn, handleSubmit_fn2, handleValidation_fn2, getWinningAndBonusNumbers_fn, _LottoResult_instances, manageEventListeners_fn, closeDialog_fn, restartGame_fn, _LottoController_instances, setEvent_fn, handlePurchase_fn, handleResult_fn, handleRestart_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const getUniqueRandomNumbers = (min, max, count) => {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  numbers.sort(() => Math.random() - 0.5);
  return numbers.slice(0, count);
};
const MIN_UNIT = 1e3;
const MAX_AMOUNT = 1e5;
const MIN_LOTTO_NUMBER = 1;
const MAX_LOTTO_NUMBER = 45;
const LOTTO_LENGTH = 6;
const MATCH_KEY = Object.freeze({
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  FIVE_AND_BONUS: 5.5,
  SIX: 6
});
const MATCH_PRIZE = Object.freeze({
  [MATCH_KEY.THREE]: 5e3,
  [MATCH_KEY.FOUR]: 5e4,
  [MATCH_KEY.FIVE]: 15e5,
  [MATCH_KEY.FIVE_AND_BONUS]: 3e7,
  [MATCH_KEY.SIX]: 2e9
});
const PURCHASE_AMOUNT_ERROR_MESSAGES = Object.freeze({
  NOT_A_NUMBER: "구입 금액은 숫자여야 합니다.",
  BELOW_MINIMUM: `구입 금액은 ${MIN_UNIT.toLocaleString()}원 이상이어야 합니다.`,
  INVALID_UNIT: `구입 금액은 ${MIN_UNIT.toLocaleString()}원 단위여야 합니다.`,
  ABOVE_MAXIMUM: `구입 금액은 ${MAX_AMOUNT.toLocaleString()}원 이하여야 합니다.`
});
const WINNING_NUMBERS_ERROR_MESSAGES = Object.freeze({
  INVALID_COUNT: `당첨 번호는 ${LOTTO_LENGTH}개여야 합니다.`,
  NOT_A_NUMBER: "당첨 번호는 숫자여야 합니다.",
  NOT_AN_INTEGER: "당첨 번호는 정수여야 합니다.",
  OUT_OF_RANGE: `당첨 번호의 범위는 ${MIN_LOTTO_NUMBER} 이상 ${MAX_LOTTO_NUMBER} 이하여야 합니다.`,
  DUPLICATE_NUMBER: "당첨 번호는 중복될 수 없습니다."
});
const BONUS_NUMBER_ERROR_MESSAGES = Object.freeze({
  NOT_A_NUMBER: "보너스 번호는 숫자여야 합니다.",
  NOT_AN_INTEGER: "보너스 번호는 정수여야 합니다.",
  OUT_OF_RANGE: `보너스 번호의 범위는 ${MIN_LOTTO_NUMBER} 이상 ${MAX_LOTTO_NUMBER} 이하여야 합니다.`,
  DUPLICATE_NUMBER: "보너스 번호는 당첨 번호와 중복될 수 없습니다."
});
const EVENT_TYPES = Object.freeze({
  input: "input",
  submit: "submit",
  click: "click",
  purchase: "purchase",
  result: "result",
  restart: "restart"
});
const STYLE_SELECTORS = Object.freeze({
  hidden: "hidden"
});
const CUSTOM_ELEMENTS = Object.freeze({
  lottoHeader: "lotto-header",
  lottoPurchase: "lotto-purchase",
  issuedLotto: "issued-lotto",
  winningLotto: "winning-lotto",
  lottoResult: "lotto-result",
  lottoFooter: "lotto-footer"
});
const issueLottos = (purchaseAmount) => {
  const lottoCount = purchaseAmount / MIN_UNIT;
  return Array.from({ length: lottoCount }, () => {
    return getUniqueRandomNumbers(
      MIN_LOTTO_NUMBER,
      MAX_LOTTO_NUMBER,
      LOTTO_LENGTH
    ).sort((a, b) => a - b);
  });
};
const countMatchingNumbers = (referenceArray, checkingArray) => {
  return checkingArray.filter((number) => referenceArray.includes(number)).length;
};
const createWinningStatisticsMap = (counts = {}) => {
  return /* @__PURE__ */ new Map([
    [
      MATCH_KEY.THREE,
      {
        count: counts[MATCH_KEY.THREE] ?? 0,
        amount: MATCH_PRIZE[MATCH_KEY.THREE]
      }
    ],
    [
      MATCH_KEY.FOUR,
      {
        count: counts[MATCH_KEY.FOUR] ?? 0,
        amount: MATCH_PRIZE[MATCH_KEY.FOUR]
      }
    ],
    [
      MATCH_KEY.FIVE,
      {
        count: counts[MATCH_KEY.FIVE] ?? 0,
        amount: MATCH_PRIZE[MATCH_KEY.FIVE]
      }
    ],
    [
      MATCH_KEY.FIVE_AND_BONUS,
      {
        count: counts[MATCH_KEY.FIVE_AND_BONUS] ?? 0,
        amount: MATCH_PRIZE[MATCH_KEY.FIVE_AND_BONUS]
      }
    ],
    [
      MATCH_KEY.SIX,
      {
        count: counts[MATCH_KEY.SIX] ?? 0,
        amount: MATCH_PRIZE[MATCH_KEY.SIX]
      }
    ]
  ]);
};
class WinningStatistics {
  constructor(lottos) {
    __privateAdd(this, _WinningStatistics_instances);
    __privateAdd(this, _lottos, []);
    __privateAdd(this, _statistics, createWinningStatisticsMap());
    __privateSet(this, _lottos, lottos);
  }
  get statistics() {
    return new Map(__privateGet(this, _statistics));
  }
  calculateProfitRatio(purchaseAmount) {
    const profitAmount = Array.from(__privateGet(this, _statistics).values()).reduce(
      (sum, { count, amount }) => sum + count * amount,
      0
    );
    const PERCENTAGE = 100;
    const DECIMAL_POINT = 1;
    return (profitAmount / purchaseAmount * PERCENTAGE).toLocaleString(
      "ko-KR",
      {
        minimumFractionDigits: DECIMAL_POINT,
        maximumFractionDigits: DECIMAL_POINT
      }
    );
  }
  calculateWinningResults(winningNumbers, bonusNumber) {
    __privateGet(this, _lottos).forEach((lotto) => {
      const matchedCount = countMatchingNumbers(winningNumbers, lotto);
      if (matchedCount === MATCH_KEY.FIVE) {
        __privateMethod(this, _WinningStatistics_instances, addMatchedCount_fn).call(this, __privateMethod(this, _WinningStatistics_instances, calculateBonusNumber_fn).call(this, lotto, bonusNumber));
        return;
      }
      __privateMethod(this, _WinningStatistics_instances, addMatchedCount_fn).call(this, matchedCount);
    });
  }
}
_lottos = new WeakMap();
_statistics = new WeakMap();
_WinningStatistics_instances = new WeakSet();
calculateBonusNumber_fn = function(lotto, bonusNumber) {
  if (lotto.includes(bonusNumber)) return MATCH_KEY.FIVE_AND_BONUS;
  return MATCH_KEY.FIVE;
};
addMatchedCount_fn = function(matchedCount) {
  if (matchedCount >= MATCH_KEY.THREE) {
    __privateGet(this, _statistics).set(matchedCount, {
      ...__privateGet(this, _statistics).get(matchedCount),
      count: __privateGet(this, _statistics).get(matchedCount).count + 1
    });
  }
};
class LottoDomain {
  constructor() {
    __privateAdd(this, _purchaseAmount);
    __privateAdd(this, _lottos2);
    __privateSet(this, _purchaseAmount, 0);
    __privateSet(this, _lottos2, []);
  }
  get lottos() {
    return __privateGet(this, _lottos2);
  }
  setPurchaseAmount(amount) {
    __privateSet(this, _purchaseAmount, amount);
  }
  issueLottos() {
    __privateSet(this, _lottos2, issueLottos(__privateGet(this, _purchaseAmount)));
  }
  calculateWinningStatistics(winningNumbers, bonusNumber) {
    const winningStatistics = new WinningStatistics(__privateGet(this, _lottos2));
    winningStatistics.calculateWinningResults(winningNumbers, bonusNumber);
    return {
      statistics: winningStatistics.statistics,
      profitRatio: winningStatistics.calculateProfitRatio(__privateGet(this, _purchaseAmount))
    };
  }
}
_purchaseAmount = new WeakMap();
_lottos2 = new WeakMap();
class BaseWebComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    this.setEvent();
  }
  disconnectedCallback() {
    this.removeEvent();
  }
  render() {
    this.innerHTML = this.getTemplate();
  }
  getTemplate() {
    return "";
  }
  emit(eventType, detail) {
    const customEvent = new CustomEvent(eventType, {
      bubbles: true,
      detail
    });
    this.dispatchEvent(customEvent);
  }
  setEvent() {
  }
  removeEvent() {
  }
}
class Header extends BaseWebComponent {
  getTemplate() {
    return `
      <header class="lotto-header">
        <h2 class="lotto-header__title">🎱 행운의 로또</h2>
      </header>
    `;
  }
}
customElements.define(CUSTOM_ELEMENTS.lottoHeader, Header);
class Footer extends BaseWebComponent {
  getTemplate() {
    return `<footer>Copyright 2023. woowacourse</footer>`;
  }
}
customElements.define(CUSTOM_ELEMENTS.lottoFooter, Footer);
const hideElement = (el) => {
  el.classList.add(STYLE_SELECTORS.hidden);
};
const renderElement = (el) => {
  el.classList.remove(STYLE_SELECTORS.hidden);
};
const $ = (selector, target = document) => {
  return target.querySelector(selector);
};
const $$ = (selector, target = document) => {
  return target.querySelectorAll(selector);
};
const eventOn = ({ target, eventType }, eventListener) => {
  target.addEventListener(eventType, eventListener);
};
const eventOff = ({ target, eventType }, eventListener) => {
  target.removeEventListener(eventType, eventListener);
};
const throwIfInvalid = (condition, errorMessage) => {
  if (condition) {
    throw new Error(errorMessage);
  }
};
const checkIsNumber$2 = (purchaseAmount) => {
  throwIfInvalid(
    Number.isNaN(purchaseAmount),
    PURCHASE_AMOUNT_ERROR_MESSAGES.NOT_A_NUMBER
  );
};
const checkValidMinValue = (purchaseAmount) => {
  throwIfInvalid(
    purchaseAmount < MIN_UNIT,
    PURCHASE_AMOUNT_ERROR_MESSAGES.BELOW_MINIMUM
  );
};
const checkValidUnit = (purchaseAmount) => {
  throwIfInvalid(
    purchaseAmount % MIN_UNIT !== 0,
    PURCHASE_AMOUNT_ERROR_MESSAGES.INVALID_UNIT
  );
};
const checkValidMaxValue = (purchaseAmount) => {
  throwIfInvalid(
    purchaseAmount > MAX_AMOUNT,
    PURCHASE_AMOUNT_ERROR_MESSAGES.ABOVE_MAXIMUM
  );
};
const validatePurchaseAmount = (input) => {
  const purchaseAmount = Number(input);
  checkIsNumber$2(purchaseAmount);
  checkValidMinValue(purchaseAmount);
  checkValidUnit(purchaseAmount);
  checkValidMaxValue(purchaseAmount);
  return purchaseAmount;
};
class LottoPurchase extends BaseWebComponent {
  constructor() {
    super(...arguments);
    __privateAdd(this, _LottoPurchase_instances);
  }
  getTemplate() {
    return `
      <section class="lotto-purchase">
        <h2 class="lotto-purchase__title">🎱 내 번호 당첨 확인 🎱</h2>
        <label for="purchase-amount" class="lotto-purchase__description">구입할 금액을 입력해주세요.</label>
        <form class="lotto-purchase__form">
          <input id="purchase-amount" class="lotto-purchase__input" placeholder="금액" />
          <button class="lotto-purchase__button">구입</button>
        </form>
        <p class="lotto-purchase__error ${STYLE_SELECTORS.hidden}"></p>
      </section>
    `;
  }
  setEvent() {
    const form = $(".lotto-purchase__form", this);
    eventOn(
      { target: form, eventType: EVENT_TYPES.submit },
      __privateMethod(this, _LottoPurchase_instances, handleSubmit_fn).bind(this)
    );
  }
}
_LottoPurchase_instances = new WeakSet();
handleSubmit_fn = function(event) {
  event.preventDefault();
  const purchaseAmountInput = $(".lotto-purchase__input", this).value;
  const errorElement = $(".lotto-purchase__error", this);
  __privateMethod(this, _LottoPurchase_instances, handleValidation_fn).call(this, purchaseAmountInput, errorElement);
};
handleValidation_fn = function(purchaseAmountInput, errorElement) {
  try {
    const purchaseAmount = validatePurchaseAmount(purchaseAmountInput);
    hideElement(errorElement);
    this.emit(EVENT_TYPES.purchase, { purchaseAmount });
  } catch (error) {
    errorElement.textContent = error.message;
    renderElement(errorElement);
  }
};
customElements.define(CUSTOM_ELEMENTS.lottoPurchase, LottoPurchase);
class IssuedLotto extends BaseWebComponent {
  constructor() {
    super();
    this.lottos = [];
  }
  getTemplate() {
    if (this.lottos.length === 0) {
      return "";
    }
    return `
      <section class="issued-lotto">
        <p class="issued-lotto__description">총 ${this.lottos.length}개를 구매하였습니다.</p>
        <ul class="issued-lotto__list">
          ${this.lottos.map(
      (lotto) => `
            <li class="issued-lotto__item">
              <span class="issued_lotto__icon">🎟️</span>
              <span class="issued-lotto__numbers">${lotto.join(", ")}</span>
            </li>
            `
    ).join("")}
        </ul>
      </section>
    `;
  }
  updateLottos(lottos) {
    this.lottos = lottos;
    this.render();
  }
}
customElements.define(CUSTOM_ELEMENTS.issuedLotto, IssuedLotto);
const parseWinningNumbers = (input) => {
  return input.split(",").map((el) => el.trim()).filter((el) => el !== "").map(Number);
};
const checkLength = (winningNumbers) => {
  throwIfInvalid(
    winningNumbers.length !== LOTTO_LENGTH,
    WINNING_NUMBERS_ERROR_MESSAGES.INVALID_COUNT
  );
};
const checkIsNumber$1 = (winningNumber) => {
  throwIfInvalid(
    Number.isNaN(winningNumber),
    WINNING_NUMBERS_ERROR_MESSAGES.NOT_A_NUMBER
  );
};
const checkIsInteger$1 = (winningNumber) => {
  throwIfInvalid(
    !Number.isInteger(winningNumber),
    WINNING_NUMBERS_ERROR_MESSAGES.NOT_AN_INTEGER
  );
};
const checkIsInRange$1 = (winningNumber) => {
  throwIfInvalid(
    MIN_LOTTO_NUMBER > winningNumber || MAX_LOTTO_NUMBER < winningNumber,
    WINNING_NUMBERS_ERROR_MESSAGES.OUT_OF_RANGE
  );
};
const checkIsNotDuplicate$1 = (winningNumbers) => {
  const winningNumbersSet = new Set(winningNumbers);
  throwIfInvalid(
    winningNumbers.length !== winningNumbersSet.size,
    WINNING_NUMBERS_ERROR_MESSAGES.DUPLICATE_NUMBER
  );
};
const validateWinningNumbers = (input) => {
  const winningNumbers = parseWinningNumbers(input);
  checkLength(winningNumbers);
  winningNumbers.forEach((winningNumber) => {
    checkIsNumber$1(winningNumber);
    checkIsInteger$1(winningNumber);
    checkIsInRange$1(winningNumber);
  });
  checkIsNotDuplicate$1(winningNumbers);
  return winningNumbers;
};
const checkIsNumber = (bonusNumber) => {
  throwIfInvalid(
    Number.isNaN(bonusNumber),
    BONUS_NUMBER_ERROR_MESSAGES.NOT_A_NUMBER
  );
};
const checkIsInteger = (bonusNumber) => {
  throwIfInvalid(
    !Number.isInteger(bonusNumber),
    BONUS_NUMBER_ERROR_MESSAGES.NOT_AN_INTEGER
  );
};
const checkIsInRange = (bonusNumber) => {
  throwIfInvalid(
    MIN_LOTTO_NUMBER > bonusNumber || MAX_LOTTO_NUMBER < bonusNumber,
    BONUS_NUMBER_ERROR_MESSAGES.OUT_OF_RANGE
  );
};
const checkIsNotDuplicate = (winningNumbers, bonusNumber) => {
  throwIfInvalid(
    winningNumbers.includes(bonusNumber),
    BONUS_NUMBER_ERROR_MESSAGES.DUPLICATE_NUMBER
  );
};
const validateBonusNumber = (input, winningNumbers) => {
  const bonusNumber = Number(input);
  checkIsNumber(bonusNumber);
  checkIsInteger(bonusNumber);
  checkIsInRange(bonusNumber);
  checkIsNotDuplicate(winningNumbers, bonusNumber);
  return bonusNumber;
};
class WinningLotto extends BaseWebComponent {
  constructor() {
    super();
    __privateAdd(this, _WinningLotto_instances);
    this.isInitialized = false;
  }
  getTemplate() {
    if (!this.isInitialized) {
      return "";
    }
    return `
      <section class="winning-lotto">
        <p class="winning-lotto__description">
          지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요.
        </p>
        <p class="winning-lotto__numbers">
          <span>당첨 번호</span><span>보너스 번호</span>
        </p>
        <form class="winning-lotto__form">
          <div class="winning-lotto__inputs">
            <div class="winning-lotto__winning-numbers">
              <input class="winning-lotto__input" maxlength="2" />
              <input class="winning-lotto__input" maxlength="2" />
              <input class="winning-lotto__input" maxlength="2" />
              <input class="winning-lotto__input" maxlength="2" />
              <input class="winning-lotto__input" maxlength="2" />
              <input class="winning-lotto__input" maxlength="2" />
            </div>
            <div class="winning-lotto__bonus-number">
              <input class="winning-lotto__input" maxlength="2" />
            </div>
          </div>
          <p class="winning-lotto__error ${STYLE_SELECTORS.hidden}"></p>
          <button class="winning-lotto__result-button">결과 확인하기</button>
        </form>
      </section>
      `;
  }
  initWinningLotto() {
    this.isInitialized = true;
    this.connectedCallback();
  }
  setEvent() {
    __privateMethod(this, _WinningLotto_instances, setFormEventListeners_fn).call(this);
    __privateMethod(this, _WinningLotto_instances, setInputEventListeners_fn).call(this);
  }
}
_WinningLotto_instances = new WeakSet();
setFormEventListeners_fn = function() {
  const form = $(".winning-lotto__form", this);
  if (form) {
    eventOn(
      { target: form, eventType: EVENT_TYPES.submit },
      __privateMethod(this, _WinningLotto_instances, handleSubmit_fn2).bind(this)
    );
  }
};
setInputEventListeners_fn = function() {
  const inputs = $$(".winning-lotto__input", this);
  inputs.forEach((input, index) => {
    eventOn({ target: input, eventType: EVENT_TYPES.input }, () => {
      const maxLength = input.getAttribute("maxlength");
      if (input.value.length === parseInt(maxLength, 10) && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });
};
handleSubmit_fn2 = function(event) {
  event.preventDefault();
  const { winningNumbersInput, bonusNumberInput } = __privateMethod(this, _WinningLotto_instances, getWinningAndBonusNumbers_fn).call(this);
  const errorElement = $(".winning-lotto__error", this);
  __privateMethod(this, _WinningLotto_instances, handleValidation_fn2).call(this, winningNumbersInput, bonusNumberInput, errorElement);
};
handleValidation_fn2 = function(winningNumbersInput, bonusNumberInput, errorElement) {
  try {
    const winningNumbers = validateWinningNumbers(winningNumbersInput);
    const bonusNumber = validateBonusNumber(bonusNumberInput, winningNumbers);
    hideElement(errorElement);
    this.emit(EVENT_TYPES.result, { winningNumbers, bonusNumber });
  } catch (error) {
    errorElement.textContent = error.message;
    renderElement(errorElement);
  }
};
getWinningAndBonusNumbers_fn = function() {
  const inputs = $$(
    ".winning-lotto__winning-numbers .winning-lotto__input",
    this
  );
  const winningNumbersInput = Array.from(inputs).map((input) => input.value).join(",");
  const bonusNumberInput = $(
    ".winning-lotto__bonus-number .winning-lotto__input",
    this
  ).value;
  return { winningNumbersInput, bonusNumberInput };
};
customElements.define(CUSTOM_ELEMENTS.winningLotto, WinningLotto);
class LottoResult extends BaseWebComponent {
  constructor() {
    super();
    __privateAdd(this, _LottoResult_instances);
    this.statistics = createWinningStatisticsMap();
    this.profitRatio = 0;
    this.closeButtonHandler = __privateMethod(this, _LottoResult_instances, closeDialog_fn).bind(this);
    this.restartButtonHandler = __privateMethod(this, _LottoResult_instances, restartGame_fn).bind(this);
  }
  getTemplate() {
    const rows = Object.values(MATCH_KEY).map((key) => {
      const matchText = key === MATCH_KEY.FIVE_AND_BONUS ? `${MATCH_KEY.FIVE}개+보너스볼` : `${key}개`;
      return `
      <tr class="lotto-result__row">
        <td>${matchText}</td>
        <td>${MATCH_PRIZE[key].toLocaleString()}</td>
        <td>${this.statistics.get(key).count}개</td>
      </tr>
      `;
    }).join("");
    return `
      <dialog>
        <form class="lotto-result" method="dialog">
          <button class="lotto-result__close-button">
            <img src="close-button.svg" alt="close-button" />
          </button>
          <h2 class="lotto-result__title">🏆 당첨 통계 🏆</h2>
          <table class="lotto-result__statistics">
            <tr>
              <th>일치 갯수</th>
              <th>당첨금</th>
              <th>당첨 갯수</th>
            </tr>
            ${rows}
          </table>
          <p class="lotto-result__profit">당신의 총 수익률은 ${this.profitRatio}%입니다.</p>
          <button class="lotto-result__restart-button">다시 시작하기</button>
        </form>
      </dialog>
      `;
  }
  showResult(statistics, profitRatio) {
    this.statistics = statistics;
    this.profitRatio = profitRatio;
    this.render();
    const dialog = $("dialog", this);
    dialog.showModal();
    this.setEvent();
  }
  setEvent() {
    __privateMethod(this, _LottoResult_instances, manageEventListeners_fn).call(this, eventOn);
  }
  removeEvent() {
    __privateMethod(this, _LottoResult_instances, manageEventListeners_fn).call(this, eventOff);
  }
}
_LottoResult_instances = new WeakSet();
manageEventListeners_fn = function(eventMethod) {
  const closeButton = $(".lotto-result__close-button", this);
  const restartButton = $(".lotto-result__restart-button", this);
  if (closeButton) {
    eventMethod(
      { target: closeButton, eventType: EVENT_TYPES.click },
      this.closeButtonHandler
    );
  }
  if (restartButton) {
    eventMethod(
      { target: restartButton, eventType: EVENT_TYPES.click },
      this.restartButtonHandler
    );
  }
};
closeDialog_fn = function() {
  const dialog = $("dialog", this);
  dialog.close();
  this.removeEvent();
};
restartGame_fn = function() {
  this.emit(EVENT_TYPES.restart);
  this.removeEvent();
};
customElements.define(CUSTOM_ELEMENTS.lottoResult, LottoResult);
class View {
  constructor() {
    this.app = $("#app");
    this.render();
  }
  render() {
    this.app.innerHTML = `
    <lotto-header></lotto-header>
    <div class="container">
      <main>
        <lotto-purchase></lotto-purchase>
        <issued-lotto></issued-lotto>
        <winning-lotto></winning-lotto>
        <lotto-result></lotto-result>
      </main>
    </div>
    <lotto-footer></lotto-footer>
    `;
  }
  updateIssuedLotto(lottos) {
    const issuedLotto = $(CUSTOM_ELEMENTS.issuedLotto, this.app);
    issuedLotto.updateLottos(lottos);
  }
  initWinningLotto() {
    const winningLotto = $(CUSTOM_ELEMENTS.winningLotto, this.app);
    winningLotto.initWinningLotto();
  }
  showResult(statistics, profitRatio) {
    const lottoResult = $(CUSTOM_ELEMENTS.lottoResult, this.app);
    lottoResult.showResult(statistics, profitRatio);
  }
}
class LottoController {
  constructor(domain2, view2) {
    __privateAdd(this, _LottoController_instances);
    this.domain = domain2;
    this.view = view2;
    __privateMethod(this, _LottoController_instances, setEvent_fn).call(this);
  }
}
_LottoController_instances = new WeakSet();
setEvent_fn = function() {
  this.view.app.addEventListener(
    EVENT_TYPES.purchase,
    __privateMethod(this, _LottoController_instances, handlePurchase_fn).bind(this)
  );
  this.view.app.addEventListener(
    EVENT_TYPES.result,
    __privateMethod(this, _LottoController_instances, handleResult_fn).bind(this)
  );
  this.view.app.addEventListener(
    EVENT_TYPES.restart,
    __privateMethod(this, _LottoController_instances, handleRestart_fn).bind(this)
  );
};
handlePurchase_fn = function(event) {
  const { purchaseAmount } = event.detail;
  this.domain.setPurchaseAmount(purchaseAmount);
  this.domain.issueLottos();
  this.view.updateIssuedLotto(this.domain.lottos);
  this.view.initWinningLotto();
};
handleResult_fn = function(event) {
  const { winningNumbers, bonusNumber } = event.detail;
  const { statistics, profitRatio } = this.domain.calculateWinningStatistics(
    winningNumbers,
    bonusNumber
  );
  this.view.showResult(statistics, profitRatio);
};
handleRestart_fn = function() {
  this.view.render();
};
const domain = new LottoDomain();
const view = new View();
new LottoController(domain, view);
