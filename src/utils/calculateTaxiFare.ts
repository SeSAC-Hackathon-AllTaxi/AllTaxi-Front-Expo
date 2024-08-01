export function calculateTaxiFare(
  distanceInMeters: number,
  isNightTime: boolean = false
): { fare: number; estimatedTime: number } {
  // 기본 요금 (원) - 기본거리 1.6km까지
  const baseRate = 4800;

  // 거리 요금 (원/131m)
  const distanceRate = 100;

  // 시간 요금 (원/31초)
  const timeRate = 100;

  // 심야 할증률 (00:00 ~ 04:00)
  const nightSurcharge = isNightTime ? 1.2 : 1;

  // 거리를 km로 변환
  const distanceInKm = distanceInMeters / 1000;

  // 기본 거리 (1.6km)
  const baseDistance = 1.6;

  // 추가 거리
  const additionalDistance = Math.max(0, distanceInKm - baseDistance);

  // 거리 요금 계산
  const distanceFare =
    Math.ceil((additionalDistance * 1000) / 131) * distanceRate;

  // 예상 소요 시간 (분)
  const estimatedTime = Math.ceil((distanceInKm / 30) * 60); // 평균 속도 20km/h 가정

  // 시간 요금 계산
  const timeFare = Math.ceil((estimatedTime * 60) / 31) * timeRate;

  // 총 요금 계산
  let totalFare = (baseRate + distanceFare + timeFare) * nightSurcharge;

  // 100원 단위로 반올림
  totalFare = Math.round(totalFare / 100) * 100;

  return {
    fare: totalFare,
    estimatedTime: estimatedTime,
  };
}
