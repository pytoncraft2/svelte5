import { PUBLIC_URL_API } from '$env/static/public';
// const baseUrl = "http://127.0.0.1:5000";
const baseUrl = PUBLIC_URL_API;

export async function GET(route) {
  const res = await fetch(baseUrl + route);
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data);
  }
}

export async function PUT(route, donnes) {
  console.log("DONNES", donnes);
  const res = await fetch(baseUrl + route, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donnes),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(data);
  }
}

export async function DELETE(route, donnes = {}) {
  const res = await fetch(baseUrl + route, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donnes),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error(data);
  }
}

export const POST = (route, data) => fetch(baseUrl + route, {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

export async function getEvenement(url = "/donnes3.json") {
  const res = await fetch(url)

  if (res.ok) {
    return await res.json();
  } else {
    // Sometimes the API will fail!
    throw new Error('Request failed');
  }
}