export const getAudioUrl = (surahId: number, ayahId: number, reciterId: string) => {
  const pad = (num: number, size: number) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  };

  const recitersMap: Record<string, string> = {
    afasy: "Alafasy_128kbps",
    abdulbasit: "Abdul_Basit_Murattal_192kbps",
    maher: "Maher_AlMuaiqly_64kbps",
    menshawi: "Minshawy_Murattal_128kbps",
    ghamadi: "Ghamadi_40kbps",
    hudhaify: "Hudhaify_128kbps",
    husary: "Husary_128kbps",
    shuraym: "Saood_ash-Shuraym_128kbps",
    sudais: "Sudais_64kbps",
    qatami: "Nasser_Alqatami_128kbps",
    dussary: "Dussary_128kbps",
    ajamy: "Ahmed_ibn_Ali_al-Ajamy_64kbps",
    abbad: "Fares_Abbad_64kbps",
    tablawy: "Mohammad_al_Tablaway_128kbps",
  };

  const reciterPath = recitersMap[reciterId] || "Alafasy_128kbps";
  const sId = pad(surahId, 3);
  const aId = pad(ayahId, 3);

  return `https://everyayah.com/data/${reciterPath}/${sId}${aId}.mp3`;
};
