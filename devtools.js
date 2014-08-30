// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.devtools.panels.elements.createSidebarPane(
    "Gradient Inspector",
    function(sidebar) {
  function updateElementProperties() {
    sidebar.setPage("sidebarPanel.html");
    sidebar.setHeight("100ex");
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties);
});
