chrome.runtime.onInstalled.addListener(() => {
  const menuTitle = chrome.i18n.getMessage("contextMenuTitle");
  
  chrome.contextMenus.create({
    id: "renameTab",
    title: menuTitle,
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "renameTab") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showRenameDialog,
      args: [tab.id]
    });
  }
});

function showRenameDialog(tabId) {
  const promptMessage = chrome.i18n.getMessage("renamePrompt");
  let newName = prompt(promptMessage, document.title);
  if (newName) {
    chrome.storage.local.set({ ['tab_' + tabId]: newName }, () => {
      document.title = newName;
    });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: restoreTitle,
      args: [tabId]
    });
  }
});

function restoreTitle(tabId) {
  chrome.storage.local.get(['tab_' + tabId], (result) => {
    if (result['tab_' + tabId]) {
      document.title = result['tab_' + tabId];
    }
  });
}

// async function getUserCountry() {
//   try {
//     const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN');
//     const data = await response.json();
//     return data.country;
//   } catch (error) {
//     console.error('Error fetching user country:', error);
//     return null;
//   }
// }
