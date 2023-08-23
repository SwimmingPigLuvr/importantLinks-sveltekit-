<script lang="ts">
  import { buttonStyles, convert } from "$lib/theme";
  import { onMount } from "svelte";
  import type { CustomTheme } from "$lib/theme";

    // one export to rulle them all
    export let customTheme: CustomTheme;

    // link data items
    export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
    export let iconURLalt = 'ha';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;

    let buttonStyle = 'squareFill';
    let buttonColor = 'black';
    let buttonFontColor = 'white';

    // buttons
    if (customTheme && customTheme.button) {
      buttonStyle = customTheme.button.style;
      buttonColor = customTheme.button.color;
      buttonFontColor = customTheme.button.fontColor;
    }


    // convert tailwind classes to hex codes for more robust uses
    let buttonColorHex: string | undefined = convert(buttonColor);
    let buttonFontColorHex: string | undefined = convert(buttonFontColor);

    // fonts
    let font: string = customTheme.font.family;


  onMount(() => {
    
  })


    
    let buttonRadius = '';
    let fill = false;
    let outline = false;
    let shadow = false;


    

    $: if (buttonStyle in buttonStyles) {
    let style = buttonStyles[buttonStyle];
    buttonRadius = style.buttonRadius;
    fill = style.fill;
    outline = style.outline;
    shadow = style.shadow;
    console.log(`Button style: ${buttonStyle}`);
  }
  
</script>

     <!-- if fill then bg-{buttonColor ? {buttonColor} : 'secondary'}, -->



     <!-- todo make the conditional styles neccessary to apply: -->
     <!-- buttonColorHex to the border and shadow of outline and shadow -->


<a 
  href="{url}" 
  style={shadow? `box-shadow: 0 10px 20px  -12px ${buttonColorHex};` : '' + (outline ? `border: 3px solid ${buttonColorHex};` : '')}
    class="{previewMode ? 'h-[43px]  p-[0.1rem] lg:max-w-[100%]' : 'md:max-w-2xl p-[0.4rem]'} max-w-[94%] 
     {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.5rem]'} border-0  
     {fill ? `bg-${buttonColor ? buttonColor : 'secondary'}` : 'bg-opacity-0'}
     {outline ? `border-2'}` : 'border-transparent'}
     {shadow ? 'shadow-xl' : 'shadow-none'}
     hover:translate-x-1 hover:translate-y-1 
     flex justify-between m-auto items-center no-underline">

     <!-- link icon -->
    <img 
      src={iconURL} 
      alt={iconURLalt} 
      class="{previewMode? 'h-8 w-8' : ''} w-12 h-12 {buttonRadius === 'full' ? 'rounded-full' : buttonRadius === 'none' ? 'rounded-none' : 'rounded-[0.23rem]'}">
    
    <!-- Link title -->
    <p 
      style={`color: ${buttonFontColorHex};` + (previewMode ? `transform: translateX(-1rem); font-size: 1rem;` : 'transform: translateX(-1.6rem);')}
      class='font-{font}  text-xl'>{title}
    </p>
    <!-- empty element -->
    <div class="right"></div>
</a>

