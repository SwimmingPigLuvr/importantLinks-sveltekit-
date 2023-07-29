<script lang="ts">
    export let iconURL = 'ha';
    export let icon = 'default';
    export let url = 'foo';
    export let title = 'some cool title';
    let userFont = 'elven';

  
</script>

<a 
  href="{url}" class="m-auto  rounded-full hover:translate-x-1 hover:translate-y-1 stack w-full max-w-[94%] md:max-w-2xl text-center bg-black flex justify-between items-center p-[0.4rem] border-[0.1rem] no-underline relative">
    <img 
      
      src={iconURL} 
      alt={icon} 
      class="w-12 h-12 rounded-full">
    <span 
      class={`text-[2rem] absolute text-white font-${userFont} text-center`}>{title}</span>
</a>