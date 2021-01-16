using System;
public class Predict
{
   public static void __teaching_proper_MLP_21_9_1( double[] ContInputs, string[] CatInputs )
   {
     //"Input Variable" comment is added besides Input(Response) variables.
     int Cont_idx=0;
     int Cat_idx=0;
     double _building_area__ = ContInputs[Cont_idx++]; //Input Variable
     double _carport_count__ = ContInputs[Cont_idx++]; //Input Variable
     double _garage_count__ = ContInputs[Cont_idx++]; //Input Variable
     double _open_spaces_count__ = ContInputs[Cont_idx++]; //Input Variable
     double _bathrooms__ = ContInputs[Cont_idx++]; //Input Variable
     double _bedrooms__ = ContInputs[Cont_idx++]; //Input Variable
     double _number_of_sales__ = ContInputs[Cont_idx++]; //Input Variable
     double _average_price__ = ContInputs[Cont_idx++]; //Input Variable
     double _median_rental_price__ = ContInputs[Cont_idx++]; //Input Variable
     double _change_in_rental_rate__ = ContInputs[Cont_idx++]; //Input Variable
     string _property_type_id__ = CatInputs[Cat_idx++]; //Input Variable
    double[] __stat_max_input = new double[10];

    __stat_max_input[0]= 3.00000000000000e+002;
    __stat_max_input[1]= 8.00000000000000e+000;
    __stat_max_input[2]= 1.10000000000000e+001;
    __stat_max_input[3]= 1.00000000000000e+001;
    __stat_max_input[4]= 3.00000000000000e+000;
    __stat_max_input[5]= 5.00000000000000e+000;
    __stat_max_input[6]= 8.82000000000000e+002;
    __stat_max_input[7]= 9.75000000000000e+006;
    __stat_max_input[8]= 4.95000000000000e+005;
    __stat_max_input[9]= 2.89000000000000e+002;

    double[] __stat_min_input = new double[10];

    __stat_min_input[0]= 5.00000000000000e+001;
    __stat_min_input[1]= 0.00000000000000e+000;
    __stat_min_input[2]= 0.00000000000000e+000;
    __stat_min_input[3]= 0.00000000000000e+000;
    __stat_min_input[4]= 1.00000000000000e+000;
    __stat_min_input[5]= 1.00000000000000e+000;
    __stat_min_input[6]= 1.00000000000000e+000;
    __stat_min_input[7]= 1.00000000000000e+005;
    __stat_min_input[8]= 0.00000000000000e+000;
    __stat_min_input[9]= -1.00000000000000e+002;

    double[] __stat_max_target = new double[1];
    __stat_max_target[0]= 8.00000000000000e+005;

    double[] __stat_min_target = new double[1];
    __stat_min_target[0]= 1.00000000000000e+005;
    double[,] __stat_i_h_wts = new double[9,21];
    __stat_i_h_wts[0,0]=-3.74695424303563e+000;
    __stat_i_h_wts[0,1]=8.80327911833777e+000;
    __stat_i_h_wts[0,2]=-2.62200190596605e+000;
    __stat_i_h_wts[0,3]=5.05430001768173e-001;
    __stat_i_h_wts[0,4]=3.68607487480906e+000;
    __stat_i_h_wts[0,5]=-1.75440268581406e+000;
    __stat_i_h_wts[0,6]=-2.20945348821312e+000;
    __stat_i_h_wts[0,7]=1.03998270578372e+001;
    __stat_i_h_wts[0,8]=1.04827638844358e+000;
    __stat_i_h_wts[0,9]=2.51551111309269e+001;
    __stat_i_h_wts[0,10]=6.13405676927739e+000;
    __stat_i_h_wts[0,11]=3.30868549492969e-001;
    __stat_i_h_wts[0,12]=-1.12616483010226e+001;
    __stat_i_h_wts[0,13]=5.17746414145129e-001;
    __stat_i_h_wts[0,14]=1.75847380815526e+000;
    __stat_i_h_wts[0,15]=-1.11294438117668e-002;
    __stat_i_h_wts[0,16]=-5.47534203194262e+000;
    __stat_i_h_wts[0,17]=-2.11268889244173e+000;
    __stat_i_h_wts[0,18]=-1.67965020071394e+000;
    __stat_i_h_wts[0,19]=6.58981526005262e+000;
    __stat_i_h_wts[0,20]=-1.56351356505692e+000;
    __stat_i_h_wts[1,0]=-1.67218776981920e-001;
    __stat_i_h_wts[1,1]=-4.54625895453751e+000;
    __stat_i_h_wts[1,2]=-1.93101133004951e+000;
    __stat_i_h_wts[1,3]=6.51593686017428e-001;
    __stat_i_h_wts[1,4]=2.82675810913731e+000;
    __stat_i_h_wts[1,5]=1.09714341054083e+000;
    __stat_i_h_wts[1,6]=-3.70679990197027e+000;
    __stat_i_h_wts[1,7]=-1.32145453740465e+001;
    __stat_i_h_wts[1,8]=-7.64009520160373e-001;
    __stat_i_h_wts[1,9]=5.93410887559982e+000;
    __stat_i_h_wts[1,10]=-2.88209932322992e+000;
    __stat_i_h_wts[1,11]=6.01654405175162e-001;
    __stat_i_h_wts[1,12]=4.45863171736489e-001;
    __stat_i_h_wts[1,13]=7.79382168698538e-001;
    __stat_i_h_wts[1,14]=6.92390455791189e+000;
    __stat_i_h_wts[1,15]=-2.55659786958079e-002;
    __stat_i_h_wts[1,16]=-1.31167861243867e+000;
    __stat_i_h_wts[1,17]=-4.34668697752020e+000;
    __stat_i_h_wts[1,18]=5.54361078572833e+000;
    __stat_i_h_wts[1,19]=-3.07666876364801e+000;
    __stat_i_h_wts[1,20]=-2.76385920991654e-002;
    __stat_i_h_wts[2,0]=1.62066151745600e+000;
    __stat_i_h_wts[2,1]=3.58930562091560e+000;
    __stat_i_h_wts[2,2]=1.65555113543822e+000;
    __stat_i_h_wts[2,3]=-2.56962376911591e+000;
    __stat_i_h_wts[2,4]=9.93521360857537e-001;
    __stat_i_h_wts[2,5]=4.64136454282061e-001;
    __stat_i_h_wts[2,6]=2.31157571192460e+000;
    __stat_i_h_wts[2,7]=9.67521392123815e+000;
    __stat_i_h_wts[2,8]=-1.29726479208203e-001;
    __stat_i_h_wts[2,9]=-4.94169476963029e+000;
    __stat_i_h_wts[2,10]=-7.06357949123667e-001;
    __stat_i_h_wts[2,11]=-6.33272066583827e-001;
    __stat_i_h_wts[2,12]=-3.31452477499755e+000;
    __stat_i_h_wts[2,13]=-7.32359269906306e-001;
    __stat_i_h_wts[2,14]=2.57285067836654e+000;
    __stat_i_h_wts[2,15]=1.98349797937427e-002;
    __stat_i_h_wts[2,16]=-2.38758529831885e+000;
    __stat_i_h_wts[2,17]=7.47692739614543e-001;
    __stat_i_h_wts[2,18]=9.59032715657885e-001;
    __stat_i_h_wts[2,19]=6.06808845370792e-001;
    __stat_i_h_wts[2,20]=3.93708365375553e-001;
    __stat_i_h_wts[3,0]=-1.23436265872341e-002;
    __stat_i_h_wts[3,1]=-2.57819228727838e+000;
    __stat_i_h_wts[3,2]=-1.66423187916516e+000;
    __stat_i_h_wts[3,3]=-2.34375536850610e-001;
    __stat_i_h_wts[3,4]=-1.89873592947885e+000;
    __stat_i_h_wts[3,5]=5.76873456948957e-001;
    __stat_i_h_wts[3,6]=1.27442717117625e+000;
    __stat_i_h_wts[3,7]=-2.13547037893658e+001;
    __stat_i_h_wts[3,8]=6.89110867679751e-001;
    __stat_i_h_wts[3,9]=-1.91784711888474e+001;
    __stat_i_h_wts[3,10]=4.28468412721788e-001;
    __stat_i_h_wts[3,11]=1.72051890279987e+000;
    __stat_i_h_wts[3,12]=-6.08001643827328e+000;
    __stat_i_h_wts[3,13]=2.07081062657528e+000;
    __stat_i_h_wts[3,14]=2.96103080116795e+000;
    __stat_i_h_wts[3,15]=-2.32251700011142e-002;
    __stat_i_h_wts[3,16]=1.90749543034651e+000;
    __stat_i_h_wts[3,17]=-1.35655619119593e+000;
    __stat_i_h_wts[3,18]=4.19443546949561e+000;
    __stat_i_h_wts[3,19]=6.08039494488224e-001;
    __stat_i_h_wts[3,20]=-3.25778318473112e+000;
    __stat_i_h_wts[4,0]=1.48194310729123e+000;
    __stat_i_h_wts[4,1]=-7.87146955202567e-003;
    __stat_i_h_wts[4,2]=6.14975818083775e-001;
    __stat_i_h_wts[4,3]=-7.81997823046458e-001;
    __stat_i_h_wts[4,4]=3.99793097218536e+000;
    __stat_i_h_wts[4,5]=1.20983321082893e+000;
    __stat_i_h_wts[4,6]=-2.89994158199280e+000;
    __stat_i_h_wts[4,7]=5.15177296317512e+000;
    __stat_i_h_wts[4,8]=1.22431477733533e+000;
    __stat_i_h_wts[4,9]=-2.58950566130288e+000;
    __stat_i_h_wts[4,10]=-3.59688899894696e+000;
    __stat_i_h_wts[4,11]=-5.52225410794502e-001;
    __stat_i_h_wts[4,12]=5.47112559879194e+000;
    __stat_i_h_wts[4,13]=-6.28848043599090e-001;
    __stat_i_h_wts[4,14]=1.89260946530234e+000;
    __stat_i_h_wts[4,15]=-4.41562832259195e-002;
    __stat_i_h_wts[4,16]=3.43533707234905e-001;
    __stat_i_h_wts[4,17]=-3.62537025642970e+000;
    __stat_i_h_wts[4,18]=4.94990765160825e+000;
    __stat_i_h_wts[4,19]=-1.05674989921733e+000;
    __stat_i_h_wts[4,20]=-7.31244036527337e-001;
    __stat_i_h_wts[5,0]=4.31737885705331e-001;
    __stat_i_h_wts[5,1]=3.48829342808259e+000;
    __stat_i_h_wts[5,2]=1.72545851097024e+000;
    __stat_i_h_wts[5,3]=1.82270830908914e-001;
    __stat_i_h_wts[5,4]=-1.96004945908883e+000;
    __stat_i_h_wts[5,5]=-9.40424188552551e-001;
    __stat_i_h_wts[5,6]=2.42099459659405e+000;
    __stat_i_h_wts[5,7]=2.28158029552458e+001;
    __stat_i_h_wts[5,8]=1.43518086997106e-001;
    __stat_i_h_wts[5,9]=-2.16302134896775e+000;
    __stat_i_h_wts[5,10]=-1.39965288357421e+000;
    __stat_i_h_wts[5,11]=2.64704097558557e-001;
    __stat_i_h_wts[5,12]=-4.78194838439253e-001;
    __stat_i_h_wts[5,13]=2.85065664861725e-001;
    __stat_i_h_wts[5,14]=9.35721803848455e-001;
    __stat_i_h_wts[5,15]=-4.69069022973074e-003;
    __stat_i_h_wts[5,16]=1.54067213338924e-002;
    __stat_i_h_wts[5,17]=-8.17733208197051e-001;
    __stat_i_h_wts[5,18]=1.83662298341902e+000;
    __stat_i_h_wts[5,19]=-1.66723808056920e+000;
    __stat_i_h_wts[5,20]=1.35079455285017e+000;
    __stat_i_h_wts[6,0]=6.52567088914616e+000;
    __stat_i_h_wts[6,1]=9.15001121330651e+000;
    __stat_i_h_wts[6,2]=2.63850084796676e+000;
    __stat_i_h_wts[6,3]=1.25446599101826e+000;
    __stat_i_h_wts[6,4]=-1.16681168804019e+000;
    __stat_i_h_wts[6,5]=4.54574469124889e+000;
    __stat_i_h_wts[6,6]=-1.69562115938328e+000;
    __stat_i_h_wts[6,7]=-1.22236296955904e+001;
    __stat_i_h_wts[6,8]=1.29904379415973e+000;
    __stat_i_h_wts[6,9]=-1.04060974613317e+001;
    __stat_i_h_wts[6,10]=-1.59293725079775e+000;
    __stat_i_h_wts[6,11]=-2.24759054311037e-001;
    __stat_i_h_wts[6,12]=-8.16747696484144e-001;
    __stat_i_h_wts[6,13]=-2.68868259700078e-001;
    __stat_i_h_wts[6,14]=8.40970443431828e+000;
    __stat_i_h_wts[6,15]=-2.09864990300200e-002;
    __stat_i_h_wts[6,16]=1.61129513030147e+000;
    __stat_i_h_wts[6,17]=-4.42662605263154e+000;
    __stat_i_h_wts[6,18]=1.97471202190974e-001;
    __stat_i_h_wts[6,19]=1.92230928065842e+000;
    __stat_i_h_wts[6,20]=-9.74852127249932e-001;
    __stat_i_h_wts[7,0]=1.72772826239836e-001;
    __stat_i_h_wts[7,1]=1.09359711516470e-001;
    __stat_i_h_wts[7,2]=2.58066042105559e-001;
    __stat_i_h_wts[7,3]=1.20584552989270e+000;
    __stat_i_h_wts[7,4]=-9.09656742081708e-001;
    __stat_i_h_wts[7,5]=-4.75243024849759e-001;
    __stat_i_h_wts[7,6]=9.68451401748806e-001;
    __stat_i_h_wts[7,7]=3.93253519525386e+001;
    __stat_i_h_wts[7,8]=-7.91034372476010e-001;
    __stat_i_h_wts[7,9]=9.55526129807022e-001;
    __stat_i_h_wts[7,10]=2.59614881309548e-001;
    __stat_i_h_wts[7,11]=-9.78649115363495e-001;
    __stat_i_h_wts[7,12]=-1.75114216371910e+000;
    __stat_i_h_wts[7,13]=-1.24360086870149e+000;
    __stat_i_h_wts[7,14]=1.53011155963180e+000;
    __stat_i_h_wts[7,15]=-1.70270767245000e-002;
    __stat_i_h_wts[7,16]=1.27093732060041e+000;
    __stat_i_h_wts[7,17]=-1.67364103713981e+000;
    __stat_i_h_wts[7,18]=2.41871363611252e+000;
    __stat_i_h_wts[7,19]=-1.23294817534658e+000;
    __stat_i_h_wts[7,20]=-3.82116114361364e-001;
    __stat_i_h_wts[8,0]=-1.47323920679395e+001;
    __stat_i_h_wts[8,1]=-2.25196528383047e+000;
    __stat_i_h_wts[8,2]=2.32202426821384e+000;
    __stat_i_h_wts[8,3]=1.00230133442532e+001;
    __stat_i_h_wts[8,4]=-2.17489020470617e+001;
    __stat_i_h_wts[8,5]=-5.03267007060702e-002;
    __stat_i_h_wts[8,6]=5.15203774380202e+000;
    __stat_i_h_wts[8,7]=2.75063148956440e-001;
    __stat_i_h_wts[8,8]=1.03342791532057e-001;
    __stat_i_h_wts[8,9]=-2.98404881607040e+000;
    __stat_i_h_wts[8,10]=6.80984540973189e+000;
    __stat_i_h_wts[8,11]=-1.77105915116862e-001;
    __stat_i_h_wts[8,12]=-6.40674614861564e+000;
    __stat_i_h_wts[8,13]=-1.80909189965960e-001;
    __stat_i_h_wts[8,14]=6.14685287060225e+000;
    __stat_i_h_wts[8,15]=-7.60900876206616e-003;
    __stat_i_h_wts[8,16]=-7.60690357488769e+000;
    __stat_i_h_wts[8,17]=-3.38102271792773e+000;
    __stat_i_h_wts[8,18]=1.24240253760321e+001;
    __stat_i_h_wts[8,19]=-4.70975700306944e+000;
    __stat_i_h_wts[8,20]=1.57631756936350e-001;
    double[,] __stat_h_o_wts = new double[1,9];
    __stat_h_o_wts[0,0]=-3.24922697078351e+000;
    __stat_h_o_wts[0,1]=-3.91731143779142e+000;
    __stat_h_o_wts[0,2]=2.22664542752356e+000;
    __stat_h_o_wts[0,3]=-4.36294212320045e+000;
    __stat_h_o_wts[0,4]=2.89345698859494e+000;
    __stat_h_o_wts[0,5]=-6.16519617547346e+000;
    __stat_h_o_wts[0,6]=1.47881423067393e+000;
    __stat_h_o_wts[0,7]=5.57429212728659e+000;
    __stat_h_o_wts[0,8]=1.08331992929280e+000;
    double[] __stat_hidden_bias = new double[9];
    __stat_hidden_bias[0]=-6.75791157270563e+000;
    __stat_hidden_bias[1]=2.62473198534524e+000;
    __stat_hidden_bias[2]=-2.39862049259755e+000;
    __stat_hidden_bias[3]=3.32369814262277e+000;
    __stat_hidden_bias[4]=2.43782003400699e+000;
    __stat_hidden_bias[5]=2.88726468421307e-001;
    __stat_hidden_bias[6]=3.92557254113131e+000;
    __stat_hidden_bias[7]=-1.84797833589827e+000;
    __stat_hidden_bias[8]=3.07373137122875e+000;
    double[] __stat_output_bias = new double[1];
    __stat_output_bias[0]=1.61900573864608e+000;
    double[] __stat_inputs = new double[21];
    double[] __stat_hidden = new double[9];
    double[] __stat_outputs = new double[1];
    __stat_outputs[0] = -1.0e+307;
    __stat_inputs[0]=_building_area__;
    __stat_inputs[1]=_carport_count__;
    __stat_inputs[2]=_garage_count__;
    __stat_inputs[3]=_open_spaces_count__;
    __stat_inputs[4]=_bathrooms__;
    __stat_inputs[5]=_bedrooms__;
    __stat_inputs[6]=_number_of_sales__;
    __stat_inputs[7]=_average_price__;
    __stat_inputs[8]=_median_rental_price__;
    __stat_inputs[9]=_change_in_rental_rate__;

    if( _property_type_id__=="1")
    {
     __stat_inputs[10]=1;
    }
    else
    {
     __stat_inputs[10]=0;
    }

    if( _property_type_id__=="10")
    {

     __stat_inputs[11]=1;

    }
    else
    {
     __stat_inputs[11]=0;
    }

    if( _property_type_id__=="12")
    {
     __stat_inputs[12]=1;
    }
    else
    {
     __stat_inputs[12]=0;
    }

    if( _property_type_id__=="19")
    {
     __stat_inputs[13]=1;
    }
    else
    {
     __stat_inputs[13]=0;
    }

    if( _property_type_id__=="2")
    {
     __stat_inputs[14]=1;
    }
    else
    {
     __stat_inputs[14]=0;
    }

    if( _property_type_id__=="21")
    {
     __stat_inputs[15]=1;
    }
    else
    {
     __stat_inputs[15]=0;
    }

    if( _property_type_id__=="25")
    {
     __stat_inputs[16]=1;
    }
    else
    {
     __stat_inputs[16]=0;
    }

    if( _property_type_id__=="26")
    {
     __stat_inputs[17]=1;
    }
    else
    {
     __stat_inputs[17]=0;
    }

    if( _property_type_id__=="4")
    {
     __stat_inputs[18]=1;
    }
    else
    {
     __stat_inputs[18]=0;
    }

    if( _property_type_id__=="5")
    {
     __stat_inputs[19]=1;
    }
    else
    {
     __stat_inputs[19]=0;
    }

    if( _property_type_id__=="6")
    {
     __stat_inputs[20]=1;
    }
    else
    {
     __stat_inputs[20]=0;
    }

    double __stat_delta=0;
    double __stat_maximum=1;
    double __stat_minimum=0;
    int __stat_ncont_inputs=10;

    /*scale continuous inputs*/

    for(int __stat_i=0;__stat_i < __stat_ncont_inputs;__stat_i++)
    {
     __stat_delta = (__stat_maximum-__stat_minimum)/(__stat_max_input[__stat_i]-__stat_min_input[__stat_i]);
     __stat_inputs[__stat_i] = __stat_minimum - __stat_delta*__stat_min_input[__stat_i]+ __stat_delta*__stat_inputs[__stat_i];
    }

    int __stat_ninputs=21;
    int __stat_nhidden=9;

    /*Compute feed forward signals from Input layer to hidden layer*/

    for(int __stat_row=0;__stat_row < __stat_nhidden;__stat_row++)
    {
      __stat_hidden[__stat_row]=0.0;
      for(int __stat_col=0;__stat_col < __stat_ninputs;__stat_col++)
      {
       __stat_hidden[__stat_row]= __stat_hidden[__stat_row] + (__stat_i_h_wts[__stat_row,__stat_col]*__stat_inputs[__stat_col]);
      }
     __stat_hidden[__stat_row]=__stat_hidden[__stat_row]+__stat_hidden_bias[__stat_row];
    }

    for(int __stat_row=0;__stat_row < __stat_nhidden;__stat_row++)
    {
     if(__stat_hidden[__stat_row]>100.0)
     {
      __stat_hidden[__stat_row] = 1.0;
     }
     else
     {
      if(__stat_hidden[__stat_row]<-100.0)
      {
       __stat_hidden[__stat_row] = 0.0;
      }
      else
      {
      __stat_hidden[__stat_row] = 1.0/(1.0+Math.Exp(-__stat_hidden[__stat_row]));
      }
    }
  }

    int __stat_noutputs=1;
    /*Compute feed forward signals from hidden layer to output layer*/
    for(int __stat_row2=0;__stat_row2 < __stat_noutputs;__stat_row2++)
    {
     __stat_outputs[__stat_row2]=0.0;
    for(int __stat_col2=0;__stat_col2 < __stat_nhidden;__stat_col2++)
      {
       __stat_outputs[__stat_row2]= __stat_outputs[__stat_row2] + (__stat_h_o_wts[__stat_row2,__stat_col2]*__stat_hidden[__stat_col2]);
      }
     __stat_outputs[__stat_row2]=__stat_outputs[__stat_row2]+__stat_output_bias[__stat_row2];
    }

    for(int __stat_row=0;__stat_row < __stat_noutputs;__stat_row++)
    {
     if(__stat_outputs[__stat_row]>100.0)
     {
      __stat_outputs[__stat_row] = 1.0;
     }
     else
     {
      if(__stat_outputs[__stat_row]<-100.0)
      {
       __stat_outputs[__stat_row] = 0.0;
      }
      else
      {
       __stat_outputs[__stat_row] = 1.0/(1.0+Math.Exp(-__stat_outputs[__stat_row]));
      }
     }
    }

    /*Unscale continuous targets*/
    __stat_delta=0;
    for(int __stat_i=0;__stat_i < __stat_noutputs;__stat_i++)
    {
     __stat_delta = (__stat_maximum-__stat_minimum)/(__stat_max_target[__stat_i]-__stat_min_target[__stat_i]);
     __stat_outputs[__stat_i] = (__stat_outputs[__stat_i] - __stat_minimum + __stat_delta*__stat_min_target[__stat_i])/__stat_delta;
    }
      for(int __stat_ii=0; __stat_ii < __stat_noutputs; __stat_ii++)
      {
        Console.WriteLine(" Prediction{0} = {1}", __stat_ii+1, __stat_outputs[__stat_ii]);
      }
   }
   public static void Main (string[] args) {
     int argID = 0;
     double[] ContInputs = new double[10];
     int contID = 0;
     string[] CatInputs = new string[1];
     int catID = 0;
     if (args.Length >= 11)
     {
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       ContInputs[contID++] = Double.Parse(args[argID++]);
       CatInputs[catID++] = args[argID++];
     }
     else
     {
       string Comment = "";
       string Comment1 = "**************************************************************************\n";
       Comment += Comment1;
       string Comment2 = "Please enter at least 11 command line parameters in the following order for \nthe program to Predict.\n";
       Comment += Comment2;
       Comment += Comment1;
       string Comment3 = "building_area  Type - double (or) integer\n";
       Comment += Comment3;
       string Comment4 = "carport_count  Type - double (or) integer\n";
       Comment += Comment4;
       string Comment5 = "garage_count  Type - double (or) integer\n";
       Comment += Comment5;
       string Comment6 = "open_spaces_count  Type - double (or) integer\n";
       Comment += Comment6;
       string Comment7 = "bathrooms  Type - double (or) integer\n";
       Comment += Comment7;
       string Comment8 = "bedrooms  Type - double (or) integer\n";
       Comment += Comment8;
       string Comment9 = "number_of_sales  Type - double (or) integer\n";
       Comment += Comment9;
       string Comment10 = "average_price  Type - double (or) integer\n";
       Comment += Comment10;
       string Comment11 = "median_rental_price  Type - double (or) integer\n";
       Comment += Comment11;
       string Comment12 = "change_in_rental_rate  Type - double (or) integer\n";
       Comment += Comment12;
       string Comment13 = "property_type_id  Type - String (categories are { \"1\"  \"10\"  \"12\"  \"19\"  \"2\"  \"21\"  \"25\"  \"26\"  \"4\"  \"5\"  \"6\" } )\n";
       Comment += Comment13;
       Comment += Comment1;
       System.Console.WriteLine(Comment);
       System.Environment.Exit(1);
     }
     __teaching_proper_MLP_21_9_1( ContInputs, CatInputs );
   }
}

