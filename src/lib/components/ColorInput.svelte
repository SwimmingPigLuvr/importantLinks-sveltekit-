<script lang='ts'>
  import { db, user, storage, userData } from "$lib/firebase";
  import { doc, writeBatch } from "firebase/firestore";
  import { cubicInOut } from "svelte/easing";
  import { slide, blur } from "svelte/transition";


    export let mode: String;
    export let current;
    let saving: boolean = false;
    let saveSuccess: boolean = false;

    async function updateColor(mode: string, hex: string) {
        const batch = writeBatch(db);
        saving = true;

        switch (mode) {

        case 'background':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {hex: hex}}},
            { merge: true });
            break;
        
        case 'link fill':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {hex: hex}}}},
            {merge: true});
            break;

        case 'link border':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {hex: hex}}}},
            {merge: true});
            break;

        case 'link shadow':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {hex: hex}}}},
            {merge: true});
            break;
        
        case 'link title':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {title: {hex: hex}}}},
            {merge: true});
            break;
        
        case 'font':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {font: {hex: hex}}},
            {merge: true});
            break;

        case 'background gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {from: {hex: hex}}}}},
            {merge: true});
            break;

        case 'background gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {to: {hex: hex}}}}},
            {merge: true});
            break;
            
        case 'link gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'border gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'border gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'shadodw gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {from: {hex: hex}}}}}},
            {merge: true});
            break;

        case 'link gradient to':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {gradient: {to: {hex: hex}}}}}},
            {merge: true});
            break;

        default:
            return;
        }

        await batch.commit();
        saveSuccess = true;
        saving = false;
    }

    async function updateOpacity(mode: string, opacity: number) {
        const batch = writeBatch(db);
        saving = true;

        switch (mode) {

        case 'background': 
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {opacity: opacity}}},
            {merge: true});
            break;

        case 'font': 
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {font: {opacity: opacity}}},
            {merge: true});
            break;

        case 'link title':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {title: {opacity: opacity}}}},
            {merge: true});
            break;

        case 'link fill':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {fill: {opacity: opacity}}}},
            {merge: true});
            break;
            
        case 'link border':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {border: {opacity: opacity}}}},
            {merge: true});
            break;
        
        case 'link shadow':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {link: {shadow: {opacity: opacity}}}},
            {merge: true});
            break;

        case 'background gradient from':
            batch.set(doc(db, `users/${$user!.uid}`),
            {customTheme: {background: {gradient: {from: {opacity: opacity}}}}},
            {merge: true});
            break;

        case 'background gradient to':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {background: {gradient: {to: {opacity: opacity}}}}
            }, { merge: true });
            break;

        case 'link gradient from':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {fill: {gradient: {from: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'link gradient to':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {fill: {gradient: {to: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'border gradient from':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {border: {gradient: {from: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'border gradient to':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {border: {gradient: {to: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'shadow gradient from':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {shadow: {gradient: {from: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        case 'shadow gradient to':
            batch.set(doc(db, `users/${$user!.uid}`), {
            customTheme: {link: {shadow: {gradient: {to: {opacity: opacity}}}}}   
            }, { merge: true });
            break;

        default:
            return;
        }
        await batch.commit();
        saveSuccess = true;
        saving = false;
    }

</script>