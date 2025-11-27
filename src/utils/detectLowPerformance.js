export function detectLowPerformance() {
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;

  const isLowCPU = cores <= 4;
  const isLowMemory = memory <= 4;
  const isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

  return isLowCPU || isLowMemory || isMobile;
}
