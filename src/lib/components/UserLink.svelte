<script lang="ts">
  import { buttonStyles } from "$lib/theme";
  import { onMount } from "svelte";

    export let iconURL = 'https://miladymaker.net/images/milady3.jpg';
    export let iconURLalt = 'ha';
    export let url = 'foo';
    export let title = 'some cool title';
    export let previewMode = false;
    export let buttonStyle: keyof typeof buttonStyles;
    export let buttonColor: string = '';
    export let buttonColorHex: string = '';
    export let font: string = 'font-elven';
    export let buttonFontColorHex: string = '';


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
  style={shadow? `box-shadow: 0 25px 50px -12px ${buttonColorHex};` : '' + (outline ? `border: 3px solid ${buttonColorHex};` : '')}
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
      style={`color: ${buttonFontColorHex}`}
      class='font-{font}'>{title}
    </p>
    <!-- empty element -->
    <div class="right"></div>
</a>

