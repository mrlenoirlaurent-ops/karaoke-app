const fs = require('fs');

const raw = fs.readFileSync('chansons.txt', 'utf8');

const knownArtists = [
  'Claude Francois', 'Claude François', 'Téléphone', 'Telephone', 'M.Berger',
  'E.Piaf', 'A.Souchon', 'Ben l’oncle soul', 'G.Montagné', 'J.Hallyday',
  'J.J.Goldman', 'T.Hazard', 'E.Mitchell', 'Starmania', 'Nino Ferrer',
  'Niagara', 'M. Leforestier', 'Nougaro', 'C. Aznavour', 'S. Gainsbourg',
  'G.de Palmas', 'Garou Céline Dion', 'JJ Goldman', 'J. Armanet',
  'Jo Dassin', 'Céline Dion et JJ Goldman', 'Eddy Mitchell', 'V. Sanson',
  'Axel Red', 'henri Salvador', 'Michel Polnareff', 'France Gall',
  'Amel Bent', 'Images', 'Barbara', 'F. Pagny', 'Clara Lucianni',
  'M. Fugain', 'Indochine', 'Daft Punk', 'L. Cohen', 'Bonny Mc Ferrin',
  'the beatles', 'The Eagles', 'Gloria Gaynor', 'john Lennon',
  'Nina Simone', 'Bob Marley', 'Ben E. King', 'Tracy Chapman', 'Oasis',
  'F. Sinatra', 'Ray Charles', 'The doobie brothers', 'Bob Dylan',
  'The Cramberries', 'Radiohead', 'Four non blond', 'Adele', 'Lady Gaga',
  'Amy Winehouse', 'Beyonce', 'ACDC', 'The pointer Sisters', 'Scorpions',
  'Foster the people', 'Maneskin', 'Miley Cyrus', 'Bonnie Tyler',
  'Alicia Keys', 'White stripes', 'Eurythmics', 'Pinkfloyd', 'Queen',
  'Roberta Flack', 'Bruno Mars', 'Joan Jett', 'Elvis Presley',
  'Survivor', 'The clash', 'Bill withers', 'Shakira',
  'Justin Timberlake', 'Pharrel William', 'Gala', 'Nirvana'
];

function clean(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const artistSet = new Set(knownArtists.map(clean));

const lines = raw.split(/\r?\n/);
const starts = [];

for (let i = 0; i < lines.length - 1; i++) {
  const title = lines[i].trim();
  const artistLine = lines[i + 1].trim();

  if (!title) continue;

  const match = artistLine.match(/^\((.+)\)$/);
  if (!match) continue;

  const artist = match[1].trim();

  if (artistSet.has(clean(artist))) {
    starts.push({
      index: i,
      title,
      artist
    });
  }
}

const songs = [];

for (let i = 0; i < starts.length; i++) {
  const start = starts[i];
  const nextStartIndex = i + 1 < starts.length ? starts[i + 1].index : lines.length;

  const lyrics = lines
    .slice(start.index + 2, nextStartIndex)
    .join('\n')
    .trim();

  songs.push({
    title: start.title,
    artist: start.artist,
    lyrics
  });
}

fs.writeFileSync(
  './public/songs.json',
  JSON.stringify(songs, null, 2),
  'utf8'
);

console.log(`✅ ${songs.length} chansons générées`);

songs.forEach((song, i) => {
  console.log(`${i + 1}. ${song.title} - ${song.artist}`);
});
