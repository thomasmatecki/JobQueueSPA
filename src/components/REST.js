/*
 * Copyright (c) 2018 Thomas Matecki - All Rights Reserved
 *
 * This code is part of web application build for demostrative 
 * purposes only. You may use, distribute and modify this code
 * as you wish.
 */

/**
 *
 * @param id
 * @returns {Promise<Response>}
 */
export function cancelJob(id) {

  return fetch('/jobs', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id)
  }).then(function (response) {
    return response.json();
  });
}

/**
 *
 * @param name
 * @returns {Promise<Response>}
 */
export function createJob(name) {
  return fetch('/jobs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name
    })
  }).then(function (response) {
    return response.json();
  });
}

/**
 *
 * @returns {Promise<any>}
 */
export function getAllJobs() {
  return fetch('/jobs').then(response => (response.json()));
}