function havershineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return c;
}

const findClosestTask = function(tasks, lat, lng) {
  let index = 0;
  let minimumDistance = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < tasks.length; i++) {
    const distance = havershineDistance(lat, lng, tasks[i].lat, tasks[i].lng);
    if (distance < minimumDistance) {
      minimumDistance = distance;
      index = i;
    }
  }
  return index;
};

const findShortestTask = function(tasks) {
  let index = 0;
  let minimumDuration = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].duration < minimumDuration) {
      minimumDuration = tasks[i].duration;
      index = i;
    }
  }
  return index;
};

export { findClosestTask, findShortestTask };
