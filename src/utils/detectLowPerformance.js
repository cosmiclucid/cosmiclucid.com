export function detectLowPerformance() {
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;

  const isLowCPU = cores <= 4;
  const isLowMemory = memory <= 4;
  const saveData = navigator.connection?.saveData === true;

  return isLowCPU || isLowMemory || saveData;
}
