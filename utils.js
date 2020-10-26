export function SetupDrop(target) {
  let over = event => {
		event.preventDefault();
	}
  let enter = event => {
		target.classList.add('drop-over');
	}
  let leave = event => {
		target.classList.remove('drop-over');
	}
  let drop = event => {
		target.classList.remove('drop-over');
		if (window.drag_card) window.drag_card.playCard(target);
	}

	target.addEventListener('dragover', over);
	target.addEventListener('dragenter', enter);
	target.addEventListener('dragleave', leave);
	target.addEventListener('drop', drop);

  return () => {
    target.removeEventListener('dragover', over);
    target.removeEventListener('dragenter', enter);
    target.removeEventListener('dragleave', leave);
    target.removeEventListener('drop', drop);
  }
}

//TODO: make more generic?

HTMLElement.prototype.pullFrom = (target, id, callback = null) => {
  let card = target.lastElementChild;
  let from = window.document.getElementById(id);
  let cardPos = card.getBoundingClientRect();
  let fromPos = from.getBoundingClientRect();
  card.style.setProperty('--target-top', `${fromPos.top - cardPos.top}px`);
  card.style.setProperty('--target-left', `${fromPos.left - cardPos.left}px`);
  card.classList.add('pull');
  card.addEventListener('animationend', () => {
    card.style.top = `0px`;
    card.style.left = `0px`;
    card.classList.remove('pull');
    card.removeEventListener('animationend', target);
    if (callback) callback();
  });
}

HTMLElement.prototype.pushTo = (target, id, callback = null) => {
  let card = target.lastElementChild;
  let to = window.document.getElementById(id);
  let cardPos = card.getBoundingClientRect();
  let toPos = to.getBoundingClientRect();
  //let clone = target.cloneNode(true);
  //let card = clone.lastElementChild;
  //let cardPos = target.lastElementChild.getBoundingClientRect();
  //to.appendChild(clone);
  //card.style.top = `${cardPos.top - toPos.top}px`;
  //card.style.left = `${cardPos.left - toPos.left}px`;
  card.style.setProperty('--target-top', `${toPos.top - cardPos.top}px`);
  card.style.setProperty('--target-left', `${toPos.left - cardPos.left}px`);
  card.classList.add('push');
  card.addEventListener('animationend', () => {
    card.style.top = `0px`;
    card.style.left = `0px`;
    card.classList.remove('push');
    card.removeEventListener('animationend', target);
    if (callback) callback();
    //clone.remove();
  });
}

HTMLElement.prototype.bump = (target, id, callback = null) => {
  let card = target.lastElementChild;
  let to = window.document.getElementById(id);
  let cardPos = card.getBoundingClientRect();
  let toPos = to.getBoundingClientRect();
  card.style.setProperty('--target-top', `${toPos.top - cardPos.top}px`);
  card.style.setProperty('--target-left', `${toPos.left - cardPos.left}px`);
  card.classList.add('bump');
  card.addEventListener('animationend', () => {
    card.style.top = `0px`;
    card.style.left = `0px`;
    card.classList.remove('bump');
    card.removeEventListener('animationend', target);
    if (callback) callback();
  });
}