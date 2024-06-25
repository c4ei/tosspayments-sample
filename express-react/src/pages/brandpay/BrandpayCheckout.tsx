import { useEffect, useState } from "react";

// ------  SDK 초기화 ------
// TODO: clientKey는 개발자센터의 API 개별 연동 키 > 연동에 사용할 브랜드페이가 계약된 MID > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/reference/widget-sdk#sdk-설치-및-초기화
const clientKey = "test_ck_N5OWRapdA8dbwLJy01BVo1zEqZKL";
const customerKey = generateRandomString();

export function BrandpayCheckoutPage() {
  // FIXME: 타입 추가
  const [brandpay, setBrandpay] = useState<any>(null);

  useEffect(() => {
    async function fetchBrandpay() {
      try {
        // FIXME: loadPayment 메소드로 변경 필요
        const tossPayments = TossPayments(clientKey);

        const brandpay = tossPayments.brandpay({
          customerKey,
          // TODO: 개발자센터의 브랜드페이 > Redirect URL 에 아래 URL 을 추가하세요.
          redirectUrl: "http://localhost:3000/api/callback-auth",
        });

        setBrandpay(brandpay);
      } catch (error) {
        console.error("Error fetching brandpay:", error);
      }
    }

    fetchBrandpay();
  }, []);

  async function requestPayment() {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    await brandpay.requestPayment({
      amount: {
        currency: "KRW",
        value: 50_000,
      },
      orderId: generateRandomString(),
      orderName: "토스 티셔츠 외 2건",
      successUrl: window.location.origin + "/success",
      failUrl: window.location.origin + "/fail",
      customerEmail: "customer123@gmail.com",
      customerName: "김토스",
      // customerMobilePhone: "01012341234",
    });
  }

  async function addPaymentMethod() {
    await brandpay.addPaymentMethod();
  }

  async function changeOneTouchPay() {
    await brandpay.changeOneTouchPay();
  }

  async function changePassword() {
    await brandpay.changePassword();
  }

  async function isOneTouchPayEnabled() {
    const result = await brandpay.isOneTouchPayEnabled();

    alert(result);
  }

  async function openSettings() {
    await brandpay.openSettings();
  }

  return (
    <div className="wrapper">
      <div
        className="box_section"
        style={{
          padding: "40px 30px 50px 30px",
          marginTop: "30px",
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
        }}>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={requestPayment}>
          결제하기
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={addPaymentMethod}>
          결제수단추가
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={changeOneTouchPay}>
          원터치페이설정변경
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={changePassword}>
          비밀번호변경
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={isOneTouchPayEnabled}>
          원터치결제사용가능여부 조회
        </button>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={openSettings}>
          브랜드페이 설정 열기
        </button>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
